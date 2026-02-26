// 阿里云 FC Node.js 18 HTTP 触发器入口文件
'use strict';

// 阿里云 FC HTTP 触发器入口函数
exports.handler = (request, response, context) => {
  // 获取请求信息
  const uri = request.url;
  const path = request.path;
  const queries = request.queries;
  const headers = request.headers;
  const method = request.method;
  const body = request.body;
  
  // 构建响应
  response.setStatusCode(200);
  response.setHeader('content-type', 'text/html');
  
  const html = `
<!DOCTYPE html>
<html>
<head>
    <title>ImageAI - 部署成功</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #4CAF50; }
        .info { background: #f0f0f0; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .success { color: green; font-weight: bold; }
    </style>
</head>
<body>
    <h1>🎉 ImageAI 部署成功！</h1>
    <div class="info">
        <p class="success">✅ 函数计算运行正常</p>
        <p><strong>运行时间:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Node.js 版本:</strong> ${process.version}</p>
        <p><strong>请求路径:</strong> ${path}</p>
        <p><strong>请求方法:</strong> ${method}</p>
        <p><strong>URI:</strong> ${uri}</p>
    </div>
    <p>这是一个测试页面，确认函数计算部署成功。</p>
    <p>完整的 Next.js 应用需要进一步配置。</p>
</body>
</html>
  `;
  
  response.send(html);
};
