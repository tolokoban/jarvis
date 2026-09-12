"""Pydantic request/response models for the chat API."""

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Body of a POST /chat request."""

    content: str = Field(..., min_length=1, description="User message sent to the model")


class ChatResponse(BaseModel):
    """Body of a POST /chat response."""

    response: str = Field(..., description="Model-generated reply")
