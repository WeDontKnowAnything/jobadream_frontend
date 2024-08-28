from pydantic import BaseModel
from datetime import datetime
from typing import List


class CommentBase(BaseModel):
    post_id: int
    comment: str


class CommentCreate(CommentBase):
    pass


class CommentResponse(CommentBase):
    comment_id: int
    comment_date: str | None

    class Config:
        from_attributes = True


class PostBase(BaseModel):
    title: str
    content: str


class PostCreate(PostBase):
    pass


class PostResponse(PostBase):
    post_id: int
    posting_date: str | None
    comments: List[CommentResponse] = []

    class Config:
        from_attributes = True
