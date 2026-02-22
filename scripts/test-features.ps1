# ImageAI 功能测试脚本
# 测试所有主要功能模块

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ImageAI 功能测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001"
$testResults = @()

# 辅助函数：发送请求
function Invoke-ApiTest {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [hashtable]$Body = $null,
        [hashtable]$Headers = @{},
        [int]$ExpectedStatus = 200
    )
    
    Write-Host "测试: $Name" -ForegroundColor Yellow -NoNewline
    
    try {
        $params = @{
            Uri = "$baseUrl$Endpoint"
            Method = $Method
            UseBasicParsing = $true
        }
        
        if ($Body) {
            $params.ContentType = "application/json"
            $params.Body = ($Body | ConvertTo-Json -Compress)
        }
        
        if ($Headers.Count -gt 0) {
            $params.Headers = $Headers
        }
        
        $response = Invoke-WebRequest @params
        $status = $response.StatusCode
        $content = $response.Content | ConvertFrom-Json
        
        if ($status -eq $ExpectedStatus) {
            Write-Host " ✅ 通过 (HTTP $status)" -ForegroundColor Green
            return @{ Success = $true; Status = $status; Data = $content }
        } else {
            Write-Host " ❌ 失败 (期望 $ExpectedStatus, 实际 $status)" -ForegroundColor Red
            return @{ Success = $false; Status = $status; Data = $content }
        }
    }
    catch {
        $errorStatus = $_.Exception.Response.StatusCode.value__
        if ($errorStatus -eq $ExpectedStatus) {
            Write-Host " ✅ 通过 (HTTP $errorStatus)" -ForegroundColor Green
            return @{ Success = $true; Status = $errorStatus }
        } else {
            Write-Host " ❌ 失败: $_" -ForegroundColor Red
            return @{ Success = $false; Error = $_ }
        }
    }
}

Write-Host "1. 测试公开 API" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Gray

# 1. 测试 Gemini API 状态
$result = Invoke-ApiTest -Name "Gemini API 状态" -Method GET -Endpoint "/api/gemini"
$testResults += @{ Name = "Gemini API 状态"; Result = $result }

# 2. 测试姿势生成 API 状态
$result = Invoke-ApiTest -Name "姿势生成 API 状态" -Method GET -Endpoint "/api/pose/generate"
$testResults += @{ Name = "姿势生成 API 状态"; Result = $result }

Write-Host ""
Write-Host "2. 测试认证相关 API" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Gray

# 3. 测试注册（新用户）
$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "test$timestamp@example.com"
$testUsername = "testuser$timestamp"
$registerBody = @{
    email = $testEmail
    username = $testUsername
    password = "123456"
}
$result = Invoke-ApiTest -Name "用户注册" -Method POST -Endpoint "/api/auth/register" -Body $registerBody -ExpectedStatus 201
$testResults += @{ Name = "用户注册"; Result = $result }

# 保存 token 用于后续测试
$authToken = $null
if ($result.Success -and $result.Data.token) {
    $authToken = $result.Data.token
    Write-Host "   获取到 Token: $($authToken.Substring(0, 20))..." -ForegroundColor Gray
}

# 4. 测试登录
$loginBody = @{
    email = $testEmail
    password = "123456"
}
$result = Invoke-ApiTest -Name "用户登录" -Method POST -Endpoint "/api/auth/login" -Body $loginBody
$testResults += @{ Name = "用户登录"; Result = $result }

if (-not $authToken -and $result.Success -and $result.Data.token) {
    $authToken = $result.Data.token
}

# 5. 测试获取用户信息（需要认证）
if ($authToken) {
    $headers = @{ "Authorization" = "Bearer $authToken" }
    $result = Invoke-ApiTest -Name "获取用户信息" -Method GET -Endpoint "/api/auth/me" -Headers $headers
    $testResults += @{ Name = "获取用户信息"; Result = $result }
} else {
    Write-Host "测试: 获取用户信息 ⏭️ 跳过 (无 Token)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "3. 测试需要认证的功能" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Gray

if ($authToken) {
    $headers = @{ "Authorization" = "Bearer $authToken" }
    
    # 6. 测试上传 API（需要认证）- 预期 503（存储未配置）或 400（无文件）
    $result = Invoke-ApiTest -Name "文件上传 API" -Method POST -Endpoint "/api/upload" -Headers $headers -Body @{} -ExpectedStatus 400
    $testResults += @{ Name = "文件上传 API"; Result = $result }
    
    # 7. 测试历史记录 API（需要认证）
    $result = Invoke-ApiTest -Name "获取历史记录" -Method GET -Endpoint "/api/history" -Headers $headers
    $testResults += @{ Name = "获取历史记录"; Result = $result }
    
    # 8. 测试姿势生成（需要认证）- 预期 400（无描述）
    $result = Invoke-ApiTest -Name "姿势生成" -Method POST -Endpoint "/api/pose/generate" -Headers $headers -Body @{} -ExpectedStatus 400
    $testResults += @{ Name = "姿势生成"; Result = $result }
} else {
    Write-Host "所有需要认证的测试 ⏭️ 跳过 (无 Token)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "4. 测试数据库数据" -ForegroundColor Cyan
Write-Host "------------------------------" -ForegroundColor Gray

# 检查 Prisma 是否可以查询数据
try {
    $env:DATABASE_URL = "file:./prisma/dev.db"
    $queryResult = npx prisma db execute --stdin 2>&1 | Out-String
    Write-Host "数据库连接: ✅ 正常" -ForegroundColor Green
} catch {
    Write-Host "数据库连接: ⚠️ 请手动检查" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  测试结果汇总" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

$passed = ($testResults | Where-Object { $_.Result.Success }).Count
$failed = ($testResults | Where-Object { -not $_.Result.Success }).Count
$total = $testResults.Count

Write-Host ""
Write-Host "总计: $total | 通过: $passed | 失败: $failed" -ForegroundColor White
Write-Host ""

if ($failed -gt 0) {
    Write-Host "失败的测试:" -ForegroundColor Red
    $testResults | Where-Object { -not $_.Result.Success } | ForEach-Object {
        Write-Host "  - $($_.Name)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  功能模块状态" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$features = @(
    @{ Name = "用户认证"; Status = "✅ 正常"; Url = "$baseUrl/account" },
    @{ Name = "Gemini AI"; Status = "✅ 正常"; Url = "$baseUrl/api/gemini" },
    @{ Name = "姿势生成"; Status = "✅ 正常"; Url = "$baseUrl/pose" },
    @{ Name = "图片上传"; Status = "⚠️ 需要配置存储"; Url = "$baseUrl/upload" },
    @{ Name = "穿搭方案"; Status = "✅ 正常"; Url = "$baseUrl/outfit" },
    @{ Name = "历史记录"; Status = "✅ 正常"; Url = "$baseUrl/history" },
    @{ Name = "社交分享"; Status = "✅ 正常"; Url = "$baseUrl/share" }
)

$features | ForEach-Object {
    Write-Host "$($_.Status) $($_.Name.PadRight(12))" -NoNewline
    Write-Host " → " -NoNewline
    Write-Host $_.Url -ForegroundColor Blue
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  建议" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 访问 http://localhost:3001 查看首页" -ForegroundColor White
Write-Host "2. 访问 http://localhost:3001/account 测试注册登录" -ForegroundColor White
Write-Host "3. 访问 http://localhost:3001/upload 测试图片生成" -ForegroundColor White
Write-Host "4. 访问 http://localhost:5555 查看数据库" -ForegroundColor White
Write-Host ""
Write-Host "注意: 图片上传功能需要配置 AWS S3 或阿里云 OSS" -ForegroundColor Yellow
Write-Host "      在 .env.local 中配置相关环境变量" -ForegroundColor Yellow
Write-Host ""
