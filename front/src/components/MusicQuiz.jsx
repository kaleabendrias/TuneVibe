import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const MusicQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [audio, setAudio] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    fetchTopTracks();
  }, []);

  const fetchTopTracks = async () => {
    const accessToken = localStorage.getItem("spotify_access_token");
    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?limit=50",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      generateQuestions(data.items);
    } catch (error) {
      console.error("Error fetching top tracks:", error);
    }
  };

  const generateQuestions = (tracks) => {
    const shuffledTracks = shuffle(tracks);
    const generatedQuestions = shuffledTracks.slice(0, 10).map((track) => {
      const correctAnswer = track.artists[0].name;
      const otherArtists = tracks
        .map((t) => t.artists[0].name)
        .filter((artist) => artist !== correctAnswer);
      const shuffledAnswers = shuffle([
        correctAnswer,
        ...otherArtists.slice(0, 3),
      ]);

      return {
        trackName: track.name,
        previewUrl: track.preview_url,
        answers: shuffledAnswers,
        correctAnswer: correctAnswer,
      };
    });

    setQuestions(generatedQuestions);
  };

  const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const handleAnswerClick = (selectedAnswer) => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const playPreview = (previewUrl) => {
    if (audio && isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      if (audio) {
        audio.pause();
      }
      const newAudio = new Audio(previewUrl);
      setAudio(newAudio);
      newAudio.play();
      setIsPlaying(true);

      newAudio.onended = () => setIsPlaying(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    fetchTopTracks();
  };

  useEffect(() => {
    if (questions.length > 0) {
      playPreview(questions[0].previewUrl); // Start the first preview when questions load
    }
  }, [questions]);

  if (questions.length === 0) {
    return <div>Loading quiz...</div>;
  }

  if (showScore) {
    return (
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Quiz Completed!</h2>
          <p className="mb-4">
            Your score: {score} out of {questions.length}
          </p>
          <Button onClick={restartQuiz}>Restart Quiz</Button>
        </CardContent>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">
          Question {currentQuestion + 1}/{questions.length}
        </h2>
        <p className="mb-4">
          Who is the artist of the song &quot;{currentQ.trackName}&quot;?
        </p>
        <div className="grid grid-cols-2 gap-4">
          {currentQ.answers.map((answer, index) => (
            <Button key={index} onClick={() => handleAnswerClick(answer)}>
              {answer}
            </Button>
          ))}
        </div>
        {currentQ.previewUrl && (
          <Button className="mt-4" onClick={() => playPreview(currentQ.previewUrl)}>
            {isPlaying ? "Pause Preview" : "Play Preview"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default MusicQuiz;
