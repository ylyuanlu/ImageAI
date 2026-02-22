千问-图像编辑模型支持多图输入和多图输出，可精确修改图内文字、增删或移动物体、改变主体动作、迁移图片风格及增强画面细节。

qwen-image-edit-max

当前与qwen-image-edit-max-2026-01-16能力相同
支持单图编辑和多图融合。

可输出 1-6 张图片。

支持自定义分辨率。

支持提示词智能改写。

格式：PNG
分辨率：

可指定：通过 parameters.size 参数指定输出图像的宽*高（单位：像素）。

默认（不指定时）：总像素数接近 1024*1024，宽高比与输入图（多图输入时为最后一张）相近。

qwen-image-edit-max-2026-01-16

qwen-image-edit-plus

当前与qwen-image-edit-plus-2025-10-30能力相同
qwen-image-edit-plus-2025-12-15

qwen-image-edit-plus-2025-10-30

qwen-image-edit

支持单图编辑和多图融合。

仅支持输出 1 张图片。

不支持自定义分辨率。

格式：PNG

分辨率：不可指定。生成规则同上方的默认规则。

HTTP调用
北京地域：POST https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation

请求头（Headers）
Content-Type string （必选）

请求内容类型。此参数必须设置为application/json。

Authorization string（必选）

请求身份认证。接口使用阿里云百炼API-Key进行身份认证。示例值：Bearer sk-xxxx。

请求体（Request Body）
model string （必选）

模型名称，示例值qwen-image-edit-max。

input object （必选）

输入参数对象，包含以下字段：

属性

messages array （必选）

请求内容数组。当前仅支持单轮对话，因此数组内有且只有一个对象，该对象包含role和content两个属性。

属性

role string （必选）

消息发送者角色，必须设置为user。

content array （必选）

消息内容，包含1-3张图像，格式为 {"image": "..."}；以及单个编辑指令，格式为 {"text": "..."}。

属性

image string （必选）

输入图像的 URL 或 Base64 编码数据。支持传入1-3张图像。

多图输入时，按照数组顺序定义图像顺序，输出图像的比例以最后一张为准。

图像要求：

图像格式：JPG、JPEG、PNG、BMP、TIFF、WEBP和GIF。

输出图像为PNG格式，对于GIF动图，仅处理其第一帧。
图像分辨率：为获得最佳效果，建议图像的宽和高均在384像素至3072像素之间。分辨率过低可能导致生成效果模糊，过高则会增加处理时长。

图像大小：不超过10MB。

支持的输入格式

公网URL：

支持 HTTP 和 HTTPS 协议。

示例值：https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/fpakfo/image36.webp。

临时URL：

支持OSS协议，必须通过上传文件获取临时 URL。

示例值：oss://dashscope-instant/xxx/2024-07-18/xxx/cat.png。

传入 Base64 编码图像后的字符串

示例值：data:image/jpeg;base64,GDU7MtCZz...（示例已截断，仅做演示）

Base64 编码规范请参见通过Base64编码传入图片。

text string （必选）

正向提示词，用于描述期望生成的图像内容、风格和构图。

支持中英文，长度不超过800个字符，每个汉字、字母、数字或符号计为一个字符，超过部分会自动截断。

示例值：图1中的女生穿着图2中的黑色裙子按图3的姿势坐下，保持其服装、发型和表情不变，动作自然流畅。

注意：仅支持传入一个text，不传或传入多个将报错。

parameters object （可选）

控制图像生成的附加参数。

属性

n integer （可选）

输出图像的数量，默认值为1。

对于qwen-image-edit-max、qwen-image-edit-plus系列模型，可选择输出1-6张图片。

对于qwen-image-edit，仅支持输出1张图片。

negative_prompt string （可选）

反向提示词，用来描述不希望在画面中看到的内容，可以对画面进行限制。

支持中英文，长度上限500个字符，每个汉字、字母、数字或符号计为一个字符，超过部分会自动截断。

示例值：低分辨率、错误、最差质量、低质量、残缺、多余的手指、比例不良等。

size string （可选）

设置输出图像的分辨率，格式为宽*高，例如"1024*1536"。宽和高的取值范围均为[512, 2048]像素。

常见比例推荐分辨率

1:1: 1024*1024、1536*1536

2:3: 768*1152、1024*1536

3:2: 1152*768、1536*1024

3:4: 960*1280、1080*1440

4:3: 1280*960、1440*1080

9:16: 720*1280、1080*1920

16:9: 1280*720、1920*1080

21:9: 1344*576、2048*872

输出图像尺寸的规则

指定 size 参数，系统会以 size指定的宽高为目标，将实际输出图像的宽高调整为最接近的16的倍数。例如，设置1033*1032，输出图像尺寸为1040*1024。

若不设置，输出图像将保持与输入图像（多图输入时为最后一张）相似的宽高比，总像素数接近1024*1024。

支持模型：qwen-image-edit-max、qwen-image-edit-plus系列模型。

prompt_extend bool （可选）

是否开启提示词智能改写，默认值为 true。开启后，模型会优化正向提示词（text），对描述较简单的提示词效果提升明显。

支持模型：qwen-image-edit-max、qwen-image-edit-plus系列模型。

watermark bool （可选）

是否在图像右下角添加 "Qwen-Image" 水印。默认值为 false。水印样式如下：

1

seed integer （可选）

随机数种子，取值范围[0,2147483647]。

使用相同的seed参数值可使生成内容保持相对稳定。若不提供，算法将自动使用随机数种子。

注意：模型生成过程具有概率性，即使使用相同的seed，也不能保证每次生成结果完全一致。

curl --location 'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation' \
--header 'Content-Type: application/json' \
--header "Authorization: Bearer $DASHSCOPE_API_KEY" \
--data '{
    "model": "qwen-image-edit-max",
    "input": {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "image": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/thtclx/input1.png"
                    },
                    {
                        "image": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/iclsnx/input2.png"
                    },
                    {
                        "image": "https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20250925/gborgw/input3.png"
                    },
                    {
                        "text": "图1中的女生穿着图2中的黑色裙子按图3的姿势坐下"
                    }
                ]
            }
        ]
    },
    "parameters": {
        "n": 2,
        "negative_prompt": " ",
        "prompt_extend": true,
        "watermark": false,
        "size": "1024*1536"
    }
}'

output object

包含模型生成结果。

属性

choices array

结果选项列表。

属性

finish_reason string

任务停止原因，自然停止时为stop。

message object

模型返回的消息。

属性

role string

消息的角色，固定为assistant。

content array

消息内容，包含生成的图像信息。

属性

image string

生成图像的 URL，格式为PNG。链接有效期为24小时，请及时下载并保存图像。

usage object

本次调用的资源使用情况，仅调用成功时返回。

属性

image_count integer

生成图像的张数。

width integer

生成图像的宽度（像素）。

height integer

生成图像的高度（像素）。

request_id string

请求唯一标识。可用于请求明细溯源和问题排查。

code string

请求失败的错误码。请求成功时不会返回此参数，详情请参见错误信息。

message string

请求失败的详细信息。请求成功时不会返回此参数，详情请参见错误信息。

{
    "output": {
        "choices": [
            {
                "finish_reason": "stop",
                "message": {
                    "role": "assistant",
                    "content": [
                        {
                            "image": "https://dashscope-result-sz.oss-cn-shenzhen.aliyuncs.com/xxx.png?Expires=xxx"
                        },
                        {
                            "image": "https://dashscope-result-sz.oss-cn-shenzhen.aliyuncs.com/xxx.png?Expires=xxx"
                        }
                    ]
                }
            }
        ]
    },
    "usage": {
        "width": 1536,
        "image_count": 2,
        "height": 1024
    },
    "request_id": "bf37ca26-0abe-98e4-8065-xxxxxx"
}