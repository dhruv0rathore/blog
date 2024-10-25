import { useState } from 'react';

export default function Home() {
  const [inputText, setInputText] = useState(""); // Stores the transcript
  const [result, setResult] = useState(null);     // Stores the blog post
  const [processing, setProcessing] = useState(false); // Shows if AI is working
  const [error, setError] = useState(null);       // Stores any errors

  const generateBlogPost = async () => {
    if (!inputText.trim()) {
      setError("Please enter some video transcript");
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      // Create instructions for GPT-4
      const prompt = {
        role: "system",
        content: `You are a professional blog writer. Transform the following video transcript into a well-structured blog post.`,
      };

      // Send transcript to your backend
      const response = await fetch('/api/generate-blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [prompt, { role: "user", content: inputText }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate blog post');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to generate blog post. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Video Transcript to Blog Post Generator</h1>
      <textarea
        rows="10"
        cols="50"
        placeholder="Paste your video transcript here..."
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <br />
      <button onClick={generateBlogPost} disabled={processing}>
        {processing ? "Generating..." : "Generate Blog Post"}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <h2>Generated Blog Post:</h2>
          <p>{result.content}</p>
          <p><em>Read time: {result.readTime}</em></p>
        </div>
      )}
    </div>
  );
}
