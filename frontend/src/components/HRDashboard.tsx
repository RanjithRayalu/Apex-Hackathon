
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, X, Briefcase, Users, TrendingUp, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

interface Job {
  job_id: string;
  job_name: string;
  job_description: string;
}

export default function HRDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobName, setJobName] = useState("");
  const [jobId, setJobId] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://jsg008c4sk0csksc440ksss8.icfai-app.online/api/get_jobs")
      .then((res) => res.json())
      .then((data) => {
        setJobs(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch jobs:", err);
        setLoading(false);
      });
  }, []);

  const handleAddJob = () => {
    if (!jobId || !jobName || !jobDescription) {
      alert("All fields are required.");
      return;
    }

    const payload = {
      job_id: jobId,
      job_description: jobDescription,
      job_name: jobName,
    };

    fetch("https://jsg008c4sk0csksc440ksss8.icfai-app.online/api/add_job", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        setJobs((prev) => [...prev, payload]);
        setJobName("");
        setJobId("");
        setJobDescription("");
        setShowForm(false);
      })
      .catch((err) => console.error("Failed to add job:", err));
  };

  const stats = [
    { title: "Total Jobs", value: jobs.length, icon: Briefcase, color: "from-blue-500 to-blue-600" },
    { title: "AI Powered", value: "100%", icon: Bot, color: "from-purple-500 to-purple-600" },
    { title: "Efficiency", value: "+85%", icon: TrendingUp, color: "from-green-500 to-green-600" },
    { title: "Candidates", value: "1.2K+", icon: Users, color: "from-orange-500 to-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  RecruitAI Pro
                </h1>
                <p className="text-sm text-gray-600">Intelligent Recruitment Dashboard</p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Job
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="bg-white/70 backdrop-blur-sm border-white/20 hover:bg-white/80 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Jobs Section */}
        <Card className="bg-white/70 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Active Job Positions</CardTitle>
            <CardDescription>Manage and monitor your recruitment pipeline</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading positions...</span>
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-12">
                <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No job positions available</p>
                <Button
                  onClick={() => setShowForm(true)}
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  Create your first job posting
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map((job) => (
                  <Card
                    key={job.job_id}
                    className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                    onClick={() => navigate(`/job/${job.job_id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-5 h-5 text-white" />
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                          ID: {job.job_id}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {job.job_name}
                      </h3>
                      {job.job_description && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {job.job_description}
                        </p>
                      )}
                      <div className="mt-4 flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        <span>View candidates</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Job Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-2xl">
            <CardHeader className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowForm(false)}
                className="absolute right-2 top-2 h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
              <CardTitle>Create New Job Position</CardTitle>
              <CardDescription>Add a new role to your recruitment pipeline</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Job ID</label>
                <Input
                  placeholder="e.g., DEV-001"
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Job Title</label>
                <Input
                  placeholder="e.g., Senior Software Engineer"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Job Description</label>
                <Textarea
                  placeholder="Describe the role, requirements, and responsibilities..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={4}
                />
              </div>
              <Button
                onClick={handleAddJob}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                Create Position
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
