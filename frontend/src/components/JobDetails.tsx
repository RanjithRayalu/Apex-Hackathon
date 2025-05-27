
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Mail, User, Calendar, Clock, Star, Brain, FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface Resume {
  name: string;
  email: string;
  resume: string;
  score: {
    final_score: number;
  };
}

interface UploadForm {
  name: string;
  email: string;
  resumeContent: string;
}

interface EmailForm {
  Email: string;
  Name: string;
  Position: string;
  Date: string;
  Time: string;
  Status: string;
  Feedback: string;
}

export default function JobDetails() {
  const { jobId } = useParams<{ jobId: string }>();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);

  const [uploadForm, setUploadForm] = useState<UploadForm>({
    name: "",
    email: "",
    resumeContent: "",
  });

  const [emailForm, setEmailForm] = useState<EmailForm>({
    Email: "",
    Name: "",
    Position: "",
    Date: "",
    Time: "",
    Status: "invitation",
    Feedback: "",
  });

  const [jobName, setJobName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!jobId) return;
    
    fetch(`https://jsg008c4sk0csksc440ksss8.icfai-app.online/api/get_job_by_id?job_id=${jobId}`)
      .then((res) => res.json())
      .then((data) => {
        setResumes(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch resumes:", err);
        setLoading(false);
      });
  }, [jobId]);

  useEffect(() => {
    fetch("https://jsg008c4sk0csksc440ksss8.icfai-app.online/api/get_jobs")
      .then((res) => res.json())
      .then((jobs) => {
        const job = jobs.find((j: any) => j.job_id === jobId);
        if (job) setJobName(job.job_name);
      })
      .catch(() => {});
  }, [jobId]);

  const openUploadForm = () => {
    setUploadForm({ name: "", email: "", resumeContent: "" });
    setShowUploadForm(true);
  };

  const handleUploadResume = () => {
    const { name, email, resumeContent } = uploadForm;
    if (!name || !email || !resumeContent) {
      alert("All fields are required.");
      return;
    }

    fetch("https://jsg008c4sk0csksc440ksss8.icfai-app.online/api/add_resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        job_id: jobId,
        name,
        email,
        resume: resumeContent,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to upload resume");
        return res.json();
      })
      .then(() => {
        alert("Resume uploaded successfully");
        setShowUploadForm(false);
        setLoading(true);
        // Refresh resumes
        fetch(`https://jsg008c4sk0csksc440ksss8.icfai-app.online/api/get_job_by_id?job_id=${jobId}`)
          .then((res) => res.json())
          .then((data) => {
            setResumes(data || []);
            setLoading(false);
          });
      })
      .catch((err) => {
        alert(err.message || "Upload failed");
      });
  };

  const openEmailForm = (resumeObj: Resume) => {
    setSelectedResume(resumeObj);
    setEmailForm({
      Email: resumeObj.email || "",
      Name: resumeObj.name || "",
      Position: jobName || "",
      Date: "",
      Time: "",
      Status: "invitation",
      Feedback: "",
    });
    setShowEmailForm(true);
  };

  const handleSendEmail = () => {
    const { Email, Name, Position, Date, Time, Status, Feedback } = emailForm;
    if (!Email || !Name || !Position || !Date || !Time || !Status || !Feedback) {
      alert("Please fill all fields");
      return;
    }

    fetch("https://jsg008c4sk0csksc440ksss8.icfai-app.online/api/send_email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(emailForm),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to send email");
        return res.json();
      })
      .then(() => {
        alert("Email sent successfully");
        setShowEmailForm(false);
      })
      .catch((err) => {
        alert(err.message || "Sending email failed");
      });
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "from-green-500 to-green-600";
    if (score >= 6) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Excellent Match";
    if (score >= 6) return "Good Match";
    return "Fair Match";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {jobName || `Job ${jobId}`}
                </h1>
                <p className="text-sm text-gray-600">Candidate Management</p>
              </div>
            </div>
            <Button
              onClick={openUploadForm}
              className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Resume
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Candidates</p>
                  <p className="text-2xl font-bold text-gray-900">{resumes.length}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg AI Score</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {resumes.length > 0 
                      ? (resumes.reduce((acc, r) => acc + r.score.final_score, 0) / resumes.length).toFixed(1)
                      : "0"
                    }
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Matches</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {resumes.filter(r => r.score.final_score >= 8).length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Candidates Section */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Candidate Applications</CardTitle>
            <CardDescription>AI-powered candidate evaluation and management</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Analyzing candidates...</span>
              </div>
            ) : resumes.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No candidates have applied yet</p>
                <Button
                  onClick={openUploadForm}
                  variant="outline"
                  className="border-green-200 text-green-600 hover:bg-green-50"
                >
                  Upload first resume
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {resumes.map((resumeObj, idx) => (
                  <Card key={idx} className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{resumeObj.name}</h3>
                              <p className="text-sm text-gray-600">{resumeObj.email}</p>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">AI Match Score</span>
                              <Badge className={`bg-gradient-to-r ${getScoreColor(resumeObj.score.final_score)} text-white`}>
                                {getScoreLabel(resumeObj.score.final_score)}
                              </Badge>
                            </div>
                            <Progress 
                              value={(resumeObj.score.final_score / 10) * 100} 
                              className="h-2"
                            />
                            <p className="text-sm text-gray-600 mt-1">
                              {resumeObj.score.final_score.toFixed(1)} out of 10
                            </p>
                          </div>

                          <details className="group">
                            <summary className="cursor-pointer text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              View Resume Content
                            </summary>
                            <div className="mt-3 p-4 bg-gray-50 rounded-lg border">
                              <pre className="text-sm text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                                {resumeObj.resume}
                              </pre>
                            </div>
                          </details>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button
                            onClick={() => openEmailForm(resumeObj)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Mail className="w-4 h-4 mr-2" />
                            Send Email
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upload Resume Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Upload New Resume
              </CardTitle>
              <CardDescription>Add a candidate to the evaluation pipeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Candidate Name"
                value={uploadForm.name}
                onChange={(e) => setUploadForm(f => ({ ...f, name: e.target.value }))}
              />
              <Input
                type="email"
                placeholder="Email Address"
                value={uploadForm.email}
                onChange={(e) => setUploadForm(f => ({ ...f, email: e.target.value }))}
              />
              <Textarea
                placeholder="Paste resume content here..."
                value={uploadForm.resumeContent}
                onChange={(e) => setUploadForm(f => ({ ...f, resumeContent: e.target.value }))}
                rows={6}
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUploadResume}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  Upload & Analyze
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Send Email Modal */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5" />
                Send Email to {selectedResume?.name}
              </CardTitle>
              <CardDescription>Communicate with the candidate</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <Input
                    type="email"
                    value={emailForm.Email}
                    onChange={(e) => setEmailForm(f => ({ ...f, Email: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Name</label>
                  <Input
                    value={emailForm.Name}
                    onChange={(e) => setEmailForm(f => ({ ...f, Name: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Position</label>
                <Input
                  value={emailForm.Position}
                  onChange={(e) => setEmailForm(f => ({ ...f, Position: e.target.value }))}
                  readOnly
                  className="bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Date
                  </label>
                  <Input
                    type="date"
                    value={emailForm.Date}
                    onChange={(e) => setEmailForm(f => ({ ...f, Date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Time
                  </label>
                  <Input
                    type="time"
                    value={emailForm.Time}
                    onChange={(e) => setEmailForm(f => ({ ...f, Time: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Type</label>
                <Select value={emailForm.Status} onValueChange={(value) => setEmailForm(f => ({ ...f, Status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="invitation">Interview Invitation</SelectItem>
                    <SelectItem value="feedback">Feedback</SelectItem>
                    <SelectItem value="rejection">Rejection</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <Textarea
                  placeholder="Enter your message here..."
                  value={emailForm.Feedback}
                  onChange={(e) => setEmailForm(f => ({ ...f, Feedback: e.target.value }))}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowEmailForm(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendEmail}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
