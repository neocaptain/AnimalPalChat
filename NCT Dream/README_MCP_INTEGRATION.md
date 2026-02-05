# NotebookLM MCP 메시지 채널 연동 가이드

## 📌 개요
이 문서는 NotebookLM MCP 서버를 메시지 기반 인터페이스와 연결하는 방법을 설명합니다.

## 🚀 빠른 시작

### 1. 기본 사용법 (Python CLI)

```bash
python notebooklm_chat_interface.py
```

### 2. 대화형 명령어

- **질문하기**: 그냥 질문을 입력하세요
  ```
  💬 You: 드림이들에게 7이라는 숫자는 어떤 의미야?
  ```

- **노트북 목록 보기**: `/list`
- **노트북 선택**: `/select <notebook_id>`
- **종료**: `/quit` 또는 `/exit`

## 🔧 실제 MCP 연동 방법

현재 제공된 코드는 **템플릿**입니다. 실제로 MCP 서버와 통신하려면 다음 방법 중 하나를 사용하세요:

### 방법 1: MCP Python SDK 사용 (권장)

```python
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

# MCP 서버 연결
server_params = StdioServerParameters(
    command="python",
    args=["-u", "run_mcp.py"]
)

async with stdio_client(server_params) as (read, write):
    async with ClientSession(read, write) as session:
        # 도구 호출
        result = await session.call_tool(
            "notebook_query",
            arguments={
                "notebook_id": "3c5e2690-4609-444a-ab18-da053fc9c463",
                "query": "드림이들의 우정은?"
            }
        )
        print(result)
```

### 방법 2: 직접 함수 임포트 (간단한 방법)

```python
# notebooklm_mcp 패키지에서 직접 함수 임포트
from notebooklm_mcp import (
    notebook_list,
    notebook_query,
    notebook_get
)

# 노트북 목록 조회
notebooks = notebook_list(max_results=100)

# 질문하기
answer = notebook_query(
    notebook_id="3c5e2690-4609-444a-ab18-da053fc9c463",
    query="NCT Dream의 7이라는 숫자 의미는?"
)
```

### 방법 3: Antigravity IDE 내장 MCP 도구 사용 (현재 환경)

Antigravity IDE에서는 이미 MCP가 연결되어 있으므로, AI 어시스턴트에게 직접 요청하면 됩니다:

```
"NCT Dream 노트북에서 '7'의 의미를 찾아줘"
```

## 📡 웹 인터페이스 연동 (고급)

Flask/FastAPI를 사용하여 REST API로 만들 수도 있습니다:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class QueryRequest(BaseModel):
    notebook_id: str
    question: str

@app.post("/query")
async def query_notebook(request: QueryRequest):
    # MCP 호출
    answer = notebook_query(
        notebook_id=request.notebook_id,
        query=request.question
    )
    return {"answer": answer}
```

실행:
```bash
uvicorn api_server:app --reload
```

## 🎯 NCT Dream 전용 설정

`notebooklm_chat_interface.py`에서 기본 노트북 ID가 이미 설정되어 있습니다:

```python
NCT_DREAM_NOTEBOOK_ID = "3c5e2690-4609-444a-ab18-da053fc9c463"
```

## 📚 주요 MCP 도구 목록

- `notebook_list`: 노트북 목록 조회
- `notebook_get`: 노트북 상세 정보
- `notebook_query`: 노트북에 질문하기
- `notebook_create`: 새 노트북 생성
- `notebook_add_url`: URL 소스 추가
- `audio_overview_create`: 오디오 팟캐스트 생성
- `report_create`: 보고서 생성

## 🔐 인증 관련

MCP 서버는 이미 인증이 완료된 상태입니다 (`notebooklm-mcp-auth` 실행됨).
토큰은 자동으로 관리되며, 만료 시 `refresh_auth` 도구를 사용하세요.

## 💡 팁

1. **대화 컨텍스트 유지**: `conversation_id`를 저장하여 연속 대화 가능
2. **소스 지정**: 특정 소스만 검색하려면 `source_ids` 파라미터 사용
3. **타임아웃 조정**: 긴 질문은 `timeout` 파라미터 증가

## 🐛 문제 해결

- **"Server not found"**: MCP 서버 재시작 (`Ctrl+R`)
- **"401 Unauthorized"**: 인증 토큰 갱신 필요
- **무한 로딩**: `debug_python.txt` 로그 확인
