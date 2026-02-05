"""
NotebookLM MCP 서버와 메시지 채널 연동 인터페이스

이 스크립트는 NotebookLM MCP 서버의 기능을 간단한 메시지 기반 인터페이스로 제공합니다.
사용자의 질문을 받아 NotebookLM 노트북에서 답변을 검색하고 반환합니다.
"""

import sys
import json
from typing import Optional, Dict, Any

"""
⚠️ 중요: NotebookLM MCP는 직접 import할 수 없습니다!

MCP(Model Context Protocol)는 서버-클라이언트 구조로 작동합니다.
- MCP 서버: notebooklm-mcp-server (이미 Antigravity IDE에 연결됨)
- MCP 클라이언트: Antigravity IDE 또는 MCP SDK 사용

이 스크립트는 **템플릿**이며, 실제 사용을 위해서는:
1. Antigravity IDE에서 AI 어시스턴트에게 직접 질문 (가장 간단!)
2. MCP Python SDK를 사용한 비동기 클라이언트 구현
3. HTTP/WebSocket을 통한 MCP 프로토콜 통신

현재 환경에서는 방법 1을 권장합니다.
"""

print("✅ NotebookLM MCP는 이미 Antigravity IDE에 연결되어 있습니다!")


class NotebookLMChatInterface:
    """NotebookLM과 대화할 수 있는 간단한 인터페이스"""
    
    def __init__(self, default_notebook_id: Optional[str] = None):
        """
        Args:
            default_notebook_id: 기본으로 사용할 노트북 ID (선택사항)
        """
        self.default_notebook_id = default_notebook_id
        self.conversation_id = None
        
    def list_notebooks(self) -> Dict[str, Any]:
        """사용 가능한 노트북 목록 조회"""
        print("📚 노트북 목록을 불러오는 중...")
        # 실제 MCP 호출 (예시)
        # 실제 구현 시에는 MCP 클라이언트를 통해 호출
        return {
            "status": "success",
            "message": "노트북 목록 조회는 MCP 도구를 통해 직접 호출하세요."
        }
    
    def query_notebook(self, question: str, notebook_id: Optional[str] = None) -> str:
        """
        노트북에 질문하기
        
        Args:
            question: 사용자 질문
            notebook_id: 대상 노트북 ID (없으면 기본값 사용)
            
        Returns:
            답변 텍스트
        """
        target_id = notebook_id or self.default_notebook_id
        
        if not target_id:
            return "❌ 노트북 ID가 지정되지 않았습니다. 먼저 노트북을 선택해주세요."
        
        print(f"🔍 '{question}' 검색 중...")
        
        # 실제 사용법 안내
        answer = f"""
💬 질문: {question}
📖 노트북 ID: {target_id}

🤖 실제 답변을 얻으려면:
Antigravity IDE에서 AI 어시스턴트에게 다음과 같이 질문하세요:

"NCT Dream 노트북에서 '{question}' 에 대해 알려줘"

또는 Python에서 MCP SDK를 사용하세요:
```python
from mcp import ClientSession
# ... (비동기 클라이언트 구현 필요)
```
"""
        return answer
    
    def chat_loop(self):
        """대화형 루프 시작"""
        print("=" * 60)
        print("🌈 NotebookLM Chat Interface")
        print("=" * 60)
        print("명령어:")
        print("  - 질문 입력: 노트북에 질문하기")
        print("  - /list: 노트북 목록 보기")
        print("  - /select <notebook_id>: 노트북 선택")
        print("  - /quit 또는 /exit: 종료")
        print("=" * 60)
        
        while True:
            try:
                user_input = input("\n💬 You: ").strip()
                
                if not user_input:
                    continue
                
                # 명령어 처리
                if user_input.lower() in ['/quit', '/exit', 'quit', 'exit']:
                    print("👋 채팅을 종료합니다. 안녕!")
                    break
                
                elif user_input.lower() == '/list':
                    result = self.list_notebooks()
                    print(f"\n📋 {result}")
                
                elif user_input.lower().startswith('/select '):
                    notebook_id = user_input.split(' ', 1)[1].strip()
                    self.default_notebook_id = notebook_id
                    print(f"✅ 노트북 '{notebook_id}'가 선택되었습니다.")
                
                else:
                    # 일반 질문 처리
                    answer = self.query_notebook(user_input)
                    print(f"\n🤖 Assistant:\n{answer}")
                    
            except KeyboardInterrupt:
                print("\n\n👋 Ctrl+C로 종료합니다.")
                break
            except Exception as e:
                print(f"\n❌ 오류 발생: {e}")


def main():
    """메인 실행 함수"""
    # NCT Dream 노트북 ID (예시)
    NCT_DREAM_NOTEBOOK_ID = "3c5e2690-4609-444a-ab18-da053fc9c463"
    
    print("🎵 NCT Dream 전용 NotebookLM 채팅 시작!")
    
    # 인터페이스 생성 및 실행
    chat = NotebookLMChatInterface(default_notebook_id=NCT_DREAM_NOTEBOOK_ID)
    chat.chat_loop()


if __name__ == "__main__":
    main()
