千问-文生图模型（Qwen-Image）是一款通用图像生成模型，支持多种艺术风格，尤其擅长复杂文本渲染。模型支持多行布局、段落级文本生成以及细粒度细节刻画，可实现复杂的图文混合布局设计。

模型名称

模型简介

输出图像规格

qwen-image-max

当前与qwen-image-max-2025-12-30能力相同
千问图像生成模型Max系列，相较于Plus系列提升了图像的真实感与自然度，有效降低了AI合成痕迹，在人物质感、纹理细节和文字渲染等方面表现突出。

图像分辨率：可选分辨率及对应宽高比例请参见size参数设置

图像格式：png

图像张数：固定1张

qwen-image-max-2025-12-30

qwen-image-plus

当前与qwen-image能力相同
支持多样化的艺术风格，尤其擅长在图像中渲染复杂文字，可实现图文混合的布局设计。

qwen-image-plus-2026-01-09

qwen-image

当前仅qwen-image-plus、qwen-image模型支持异步接口调用。

同步接口（推荐）
HTTP调用
千问Qwen-image模型支持同步接口，一次请求即可获得结果，调用流程简单，推荐用于多数场景。

北京地域：POST https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation

请求头（Headers）
Content-Type string （必选）

请求内容类型。此参数必须设置为application/json。

Authorization string（必选）

请求身份认证。接口使用阿里云百炼API-Key进行身份认证。示例值：Bearer sk-xxxx。

请求体（Request Body）
model string （必选）

模型名称。示例值：qwen-image-max。

input object （必选）

输入的基本信息。

属性

messages array （必选）

请求内容数组。当前仅支持单轮对话，数组内有且只有一个元素。

属性

role string （必选）

消息的角色。此参数必须设置为user。

content array （必选）

消息内容数组。

属性

text string （必选）

正向提示词用于描述您期望生成的图像内容、风格和构图。

支持中英文，长度不超过800个字符，每个汉字、字母、数字或符号计为一个字符，超过部分会自动截断。

示例值：一只坐着的橘黄色的猫，表情愉悦，活泼可爱，逼真准确。

注意：仅支持传入一个text，不传或传入多个将报错。

parameters object （可选）

图像处理参数。

属性

negative_prompt string （可选）

反向提示词，用于描述不希望在图像中出现的内容，对画面进行限制。

支持中英文，长度不超过500个字符，超出部分将自动截断。

示例值：低分辨率，低画质，肢体畸形，手指畸形，画面过饱和，蜡像感，人脸无细节，过度光滑，画面具有AI感。构图混乱。文字模糊，扭曲。

size string （可选）

输出图像的分辨率，格式为宽*高。默认分辨率为1664*928。

可选的分辨率及其对应的图像宽高比例为：

1664*928（默认值）：16:9。

1472*1104：4:3 。

1328*1328：1:1。

1104*1472：3:4。

928*1664：9:16。

n integer （可选）

生成图像的数量。此参数当前固定为1，设置其他值将导致报错。

prompt_extend bool （可选）

是否开启 Prompt（提示词）智能改写功能。开启后模型将对正向提示词进行优化与润色。此功能不会修改反向提示词。

true：默认值，开启智能改写。如果希望图像内容更多样化，由模型补充细节，建议开启此选项。

false：关闭智能改写。如果图像细节更可控，建议关闭此选项，并参考文生图Prompt指南进行优化，

点击查看改写示例

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
    "model": "qwen-image-max",
    "input": {
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "text": "一副典雅庄重的对联悬挂于厅堂之中，房间是个安静古典的中式布置，桌子上放着一些青花瓷，对联上左书“义本生知人机同道善思新”，右书“通云赋智乾坤启数高志远”， 横批“智启千问”，字体飘逸，在中间挂着一幅中国风的画作，内容是岳阳楼。"
                    }
                ]
            }
        ]
    },
    "parameters": {
        "negative_prompt": "低分辨率，低画质，肢体畸形，手指畸形，画面过饱和，蜡像感，人脸无细节，过度光滑，画面具有AI感。构图混乱。文字模糊，扭曲。",
        "prompt_extend": true,
        "watermark": false,
        "size": "1664*928"
    }
}'

output object

任务输出信息。

属性

choices array

模型生成的输出内容。此数组仅包含一个元素。

属性

finish_reason string

任务停止原因，自然停止时为stop。

message object

模型返回的消息。

属性

role string

消息的角色，固定为assistant。

content array

属性

image string

生成图像的 URL，图像格式为PNG。链接有效期为24小时，请及时下载并保存图像。

task_metric object

任务结果统计。

属性

TOTAL integer

总的任务数。

SUCCEEDED integer

任务状态为成功的任务数。

FAILED integer

任务状态为失败的任务数。

usage object

输出信息统计。只对成功的结果计数。

属性

image_count integer

模型生成图像的数量，当前固定为1。

width integer

模型生成图像的宽度（像素）。

height integer

模型生成图像的高度（像素）。

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
                    "content": [
                        {
                            "image": "https://dashscope-result-sh.oss-cn-shanghai.aliyuncs.com/xxx.png?Expires=xxx"
                        }
                    ],
                    "role": "assistant"
                }
            }
        ],
        "task_metric": {
            "FAILED": 0,
            "SUCCEEDED": 1,
            "TOTAL": 1
        }
    },
    "usage": {
        "height": 928,
        "image_count": 1,
        "width": 1664
    },
    "request_id": "d0250a3d-b07f-49e1-bdc8-6793f4929xxx"
}