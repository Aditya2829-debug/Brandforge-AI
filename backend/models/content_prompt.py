from pydantic import BaseModel

class ContentRequest(BaseModel):
    niche: str
    goal: str
    content_type: str