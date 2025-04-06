import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Bot, Lightbulb, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent`;

const AIFraudAnalyzer = () => {
  const [suspiciousMessage, setSuspiciousMessage] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeWithGemini = async (message: string) => {
    setLoading(true);
    setError(null);
    setAnalysis(null);

    const prompt = `
You are a cybersecurity expert specializing in fraud detection and analysis.

Analyze this suspicious message for potential fraud or scam indicators:
"${message}"

Respond with:
1. What type of scam or fraud this appears to be
2. How this type of scam typically works
3. What specific warning signs are present in this message
4. What actions the recipient should take

Keep your response concise, informative, and helpful for non-technical users.
`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }],
            },
          ],
          generationConfig: {
            temperature: 0.2,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 800,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to analyze message');
      }

      const data = await response.json();
      const geminiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!geminiResponse) {
        throw new Error("No response received from Gemini API.");
      }

      setAnalysis(geminiResponse);
      toast({
        title: "Analysis Complete",
        description: "Gemini AI has analyzed your suspicious message.",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: err.message || "Something went wrong with the analysis.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = () => {
    if (!suspiciousMessage.trim()) {
      setError("Please enter a suspicious message to analyze");
      return;
    }
    analyzeWithGemini(suspiciousMessage);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto mt-12 mb-12">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Fraud Analyzer
        </CardTitle>
        <CardDescription>
          Not sure what type of fraud you've encountered? Let our AI help analyze suspicious messages.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <Textarea
          placeholder="Paste a suspicious message or describe what happened..."
          value={suspiciousMessage}
          onChange={(e) => setSuspiciousMessage(e.target.value)}
          className="min-h-24"
        />

        <Button
          onClick={handleAnalyze}
          disabled={loading || !suspiciousMessage.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>Analyze with Gemini AI</>
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {analysis && !error && (
          <Alert className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
            <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-500" />
            <AlertTitle className="text-amber-800 dark:text-amber-300">AI Analysis</AlertTitle>
            <AlertDescription className="text-amber-800 dark:text-amber-300 whitespace-pre-line">
              {analysis}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="text-xs text-center text-muted-foreground flex justify-center">
        <p>This analysis is powered by Google's Gemini API.</p>
      </CardFooter>
    </Card>
  );
};

export default AIFraudAnalyzer;
