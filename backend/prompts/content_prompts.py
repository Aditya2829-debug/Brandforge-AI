def generate_ideas_prompt(
    niche,
    goal,
    content_type
):

    return f"""
You are an Instagram growth expert.

Niche: {niche}
Goal: {goal}
Content Type: {content_type}

Generate 10 content ideas.

Return ONLY valid JSON:

{{
  "ideas":[
    {{
      "title":"Idea title",
      "type":"Carousel"
    }}
  ]
}}
"""