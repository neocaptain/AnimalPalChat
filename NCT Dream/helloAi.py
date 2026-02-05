from google import genai
from google.genai import types
from PIL import Image

client = genai.Client(api_key="AIzaSyB8rFQSiM-QSMoUnUG6-S9fcHb-tmH8MTw")

# prompt = """
# 앨리스, 밥, 캐롤은 같은 거리의 각각 다른 집, 빨간색, 초록색, 파란색 집에 살고 있습니다. 빨간색 집에 사는 사람은 고양이를 키웁니다. 밥은 초록색 집에 살지 않습니다. 캐롤은 개를 키웁니다. 초록색 집은 빨간색 집의 왼쪽에 있습니다. 앨리스는 고양이를 키우지 않습니다. 각 집에는 누가 살고 있으며, 어떤 반려동물을 키우는지 맞춰 보세요. 대답은 한글로 답해줘.
# """

# thoughts = ""
# answer = ""

## Stream 방식 처리
# for chunk in client.models.generate_content_stream(
#     model="gemini-3-flash-preview",
#     contents=prompt,
#     config=types.GenerateContentConfig(
#       thinking_config=types.ThinkingConfig(
#         include_thoughts=True
#       )
#     )
# ):
#   for part in chunk.candidates[0].content.parts:
#     if not part.text:
#       continue
#     elif part.thought:
#       if not thoughts:
#         print("Thoughts summary:")
#       print(part.text)
#       thoughts += part.text
#     else:
#       if not answer:
#         print("Answer:")
#       print(part.text)
#       answer += part.text
# image = Image.open("C:/Users/obzen NT-047/Saved Games/전유영/orange.webp")

# response = client.models.generate_content(
# response = client.models.generate_content_stream(    
#     model="gemini-3-flash-preview",
#     contents="AI가 어떻게 작동하는 지 아주 간단하게 설명해봐",
    # contents=[image, "이미지에 대해 설명해봐"],
    # contents=prompt,
    # contents="Provide a list of 3 famous physicists and their key contributions. 대답은 한국어로 해줘",
    # contents= "안녕?",
    # config=types.GenerateContentConfig(
        # include_thoughts=True
        # thinking_config=types.ThinkingConfig(thinking_level="low")
        # thinking_config=types.ThinkingConfig(thinking_budget=1024)
        # Turn off thinking:
        # thinking_config=types.ThinkingConfig(thinking_budget=0)
        # Turn on dynamic thinking:
        # thinking_config=types.ThinkingConfig(thinking_budget=-1)
        # system_instruction="너는 고양이고 이름은 네코야"
    #     temperature=0.1
    # ),
# )
# for chunk in response:
#     print(chunk.text, end="")
#     print("Thoughts tokens:",chunk.usage_metadata.thoughts_token_count)
#     print("Output tokens:",chunk.usage_metadata.candidates_token_count)
# print(response.text)
# print("Thoughts tokens:",response.usage_metadata.thoughts_token_count)
# print("Output tokens:",response.usage_metadata.candidates_token_count)

#### chat 구현
# chat = client.chats.create(model="gemini-3-flash-preview")
# response = chat.send_message("집에 강아지 두 마리가 있어")
# response = chat.send_message_stream("집에 강아지 두 마리가 있어.")
# print(response.text)
# for chunk in response:
#     print(chunk.text, end="")

# response = chat.send_message("우리 집에는 개가 몇 마리 있어?")
# response = chat.send_message_stream("우리 집에는 개가 몇 마리 있어?")
# print(response.text)
# for chunk in response:
#     print(chunk.text, end="")

# for message in chat.get_history():
#     print(f'role - {message.role}',end=": ")
#     print(message.parts[0].text)

##### 이미지 생성
prompt = ("제미나이 테마를 가진 근사한 레스토랑에 나노 바나나 정식이 있는 사진을 생성해줘")
response = client.models.generate_content(
    model="gemini-2.5-flash-image",
    contents=[prompt],
)

for part in response.parts:
    if part.text is not None:
        print(part.text)
    elif part.inline_data is not None:
        image = part.as_image()
        image.save("C:/Users/obzen NT-047/Saved Games/전유영/nerated_image.png")