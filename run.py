from backend import create_app  # Assuming you're using a factory pattern

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
