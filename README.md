# Haven Engine — Subletly Policy & Privacy Assistant

A local AI chatbot that answers questions about Subletly's Terms of Service and
Privacy Policy, powered by the Anthropic Claude API and served via FastAPI.

## Project Structure

```
.
├── main.py          # FastAPI backend + Haven Engine system prompt
├── policies.py      # Policy documents (replace placeholders with real content)
├── requirements.txt
├── .env.example     # Copy to .env and add your API key
└── static/
    └── index.html   # Chat UI (served at http://localhost:8000)
```

## Quick Start

### 1. Install dependencies

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Set your API key

```bash
cp .env.example .env
# Open .env and set ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Add your real policy documents

Open `policies.py` and replace the placeholder text in `TERMS_OF_SERVICE` and
`PRIVACY_POLICY` with Subletly's actual policy content.

### 4. Run

```bash
python main.py
```

Then open **http://localhost:8000** in your browser.

## API

| Method | Path      | Description                  |
|--------|-----------|------------------------------|
| GET    | `/`       | Serves the chat UI           |
| POST   | `/chat`   | Send a message, get a reply  |
| GET    | `/health` | Health check                 |

### POST `/chat`

**Request body:**
```json
{
  "message": "What is Subletly's cancellation policy?",
  "history": []
}
```

**Response:**
```json
{
  "response": "..."
}
```

`history` is an array of `{role, content}` objects for multi-turn conversations.
The UI manages this automatically.
