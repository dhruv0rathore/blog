import OpenAI from 'openai';

// Set up connection to OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Uses your API key
});

// This function handles requests from your frontend
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the messages sent from your frontend
    const { messages } = req.body;

    // Send text to GPT-4
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
      temperature: 0.7,    // Controls creativity (0-1)
      max_tokens: 2000     // Maximum length of response
    });

    // Get the blog post from GPT-4's response
    const blogPost = JSON.parse(completion.choices[0].message.content);
    
    // Calculate how long it takes to read
    const wordCount = JSON.stringify(blogPost).split(' ').length;
    blogPost.readTime = `${Math.ceil(wordCount / 200)} min read`;

    // Send the blog post back to your frontend
    return res.status(200).json(blogPost);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to generate blog post' });
  }
}
