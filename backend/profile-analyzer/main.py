import os
import json
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure the Gemini API client
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

def build_analysis_prompt(name: str, bio: str, platform: str, goals: str) -> str:
    """
    Builds a prompt to ask Gemini to analyze a personal brand.
    """
    return f"""You are a world-class personal brand strategist and marketing expert.
Analyze the following personal branding information and provide a structured feedback report.

User Profile:
- Name: {name}
- Bio: {bio}
- Platform: {platform}
- Goals: {goals}

Analyze the profile and return a JSON object with the following structure:
{{
  "brand_strengths": ["list of strengths of their profile/bio"],
  "brand_weaknesses": ["list of areas of improvement, what's missing, or weaknesses"],
  "content_recommendations": ["specific post ideas, formats, or topics matching their goals"],
  "posting_tips": ["best practices for engagement on the selected platform, timing, frequency, and hashtags/formatting"]
}}

Ensure that the JSON is valid, well-formed, and strictly uses double quotes for keys and string values. Return ONLY the JSON object. Do not wrap it in markdown code blocks like ```json or any other text.
"""

def analyze_profile(name: str, bio: str, platform: str, goals: str) -> dict:
    """
    Calls Gemini API to analyze the profile details and returns a parsed JSON dict.
    """
    # Ensure environment variables are loaded and configured
    api_key_env = os.getenv("GEMINI_API_KEY")
    if api_key_env:
        genai.configure(api_key=api_key_env)
            
    prompt = build_analysis_prompt(name, bio, platform, goals)
    
    # We use gemini-1.5-flash as it is fast, cost-effective, and supports JSON output
    model = genai.GenerativeModel("gemini-1.5-flash")
    
    # Request JSON output explicitly
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    
    # Parse the response text
    try:
        return json.loads(response.text)
    except json.JSONDecodeError:
        # Fallback to strip markdown if present
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())

class ProfileAnalyzerHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_POST(self):
        parsed_url = urllib.parse.urlparse(self.path)
        if parsed_url.path == "/analyze-profile":
            # Read content-length to get the body size
            content_length = int(self.headers.get("Content-Length", 0))
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode("utf-8"))
            except Exception as e:
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"Invalid JSON body: {str(e)}"}).encode("utf-8"))
                return

            # Extract fields
            name = data.get("name", "")
            bio = data.get("bio", "")
            platform = data.get("platform", "")
            goals = data.get("goals", "")

            if not all([name, bio, platform, goals]):
                self.send_response(400)
                self.send_header("Content-Type", "application/json")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Missing required fields (name, bio, platform, goals)"}).encode("utf-8"))
                return

            try:
                # Call gemini service to analyze
                result = analyze_profile(name, bio, platform, goals)
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(result).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.send_header("Content-Type", "application/json")
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": f"Internal Server Error: {str(e)}"}).encode("utf-8"))
        else:
            self.send_response(404)
            self.send_header("Content-Type", "application/json")
            self._send_cors_headers()
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not Found"}).encode("utf-8"))

def run(server_class=HTTPServer, handler_class=ProfileAnalyzerHandler, port=8000):
    server_address = ("", port)
    httpd = server_class(server_address, handler_class)
    print(f"Starting Profile Analyzer server on port {port}...")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down server...")
        httpd.server_close()

if __name__ == "__main__":
    run()
