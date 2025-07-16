from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "healthy", "message": "CrewAI service running"}

@app.get("/")
def root():
    return {"message": "CrewAI Design-to-Code Pipeline Service"}

if __name__ == "__main__":
    import uvicorn
    print("Starting service on port 8001...")
    uvicorn.run(app, host="0.0.0.0", port=8001) 