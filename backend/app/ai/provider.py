from abc import ABC, abstractmethod
from typing import AsyncGenerator, Dict, Any, List, Optional
from dataclasses import dataclass

@dataclass
class StreamChunk:
    text: str
    is_complete: bool = False
    input_tokens: Optional[int] = None
    output_tokens: Optional[int] = None
    total_tokens: Optional[int] = None
    error: Optional[str] = None

class LLMProvider(ABC):
    """
    Abstract interface for LLM inference providers.
    Enables plug-and-play swapping between Google Gemini, OpenAI, Anthropic, or Local models.
    """

    @abstractmethod
    async def stream_chat(
        self,
        messages: List[Dict[str, str]],
        system_instruction: str,
        model: Optional[str] = None,
        temperature: float = 0.3,
        max_output_tokens: int = 2048,
    ) -> AsyncGenerator[StreamChunk, None]:
        """
        Stream response tokens asynchronously.
        Yields StreamChunk containing token texts and final usage statistics.
        """
        pass

    @abstractmethod
    async def health_check(self) -> Dict[str, Any]:
        """
        Lightweight health and connectivity check.
        """
        pass

    @abstractmethod
    def count_tokens(self, text: str) -> int:
        """
        Estimate or compute token count.
        """
        pass
