import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowRight, Check, Lock, FileText, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

type Step = 'details' | 'evidence' | 'review' | 'submitted';

const ReportForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('details');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    date: '',
    organization: '',
    individuals: '',
    anonymous: true,
    name: '',
    email: '',
    contactMethod: 'anonymousPortal',
    files: [] as File[],
    additionalInfo: '',
  });

  const categories = [
    'Cybersecurity',
    'Environmental',
    'Financial Fraud',
    'Healthcare',
    'Corruption',
    'Safety',
    'Bribery',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (value: string, field: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ 
      ...prev, 
      anonymous: checked,
      ...(checked ? { name: '', email: '' } : {})
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        files: [...prev.files, ...newFiles],
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => {
    if (step === 'details') setStep('evidence');
    else if (step === 'evidence') setStep('review');
    else if (step === 'review') setStep('submitted');
  };

  const prevStep = () => {
    if (step === 'evidence') setStep('details');
    else if (step === 'review') setStep('evidence');
  };

  const submitReport = async () => {
    try {
      console.log('Submitting report with data:', formData);
      
      const { data, error } = await supabase
        .from('Cases')
        .insert([
          {
            title: formData.title,
            description: formData.description,
            category: formData.category,
            location: formData.location,
            date: formData.date,
            organization: formData.organization,
            individuals: formData.individuals,
            status: 'new',
            votes: 0,
            comments: 0,
            views: 0,
            progress: 0,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Report submitted successfully:', data);
      toast.success('Report submitted successfully!');
      setStep('submitted');
      
      // Redirect to cases page after 2 seconds
      setTimeout(() => {
        navigate('/cases');
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please check the console for details.');
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      {step !== 'submitted' && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {['details', 'evidence', 'review'].map((s, index) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center">
                  <div 
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium mb-2 transition-colors",
                      step === s 
                        ? "bg-primary text-white" 
                        : s === 'details' || (s === 'evidence' && step === 'review') 
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {index + 1}
                  </div>
                  <span className={cn(
                    "text-xs font-medium",
                    step === s ? "text-primary" : "text-muted-foreground"
                  )}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </span>
                </div>
                {index < 2 && (
                  <div className={cn(
                    "flex-1 h-1 mx-2",
                    (step === 'evidence' && index === 0) || (step === 'review') 
                      ? "bg-primary/20" 
                      : "bg-secondary"
                  )} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      <div className="bg-card rounded-xl border shadow-sm p-6 transition-all duration-300 animate-scale-in">
        {step === 'details' && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Report Details</h2>
              <p className="text-muted-foreground">
                Provide information about the corruption or misconduct you're reporting
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Report Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Brief summary of the issue"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe what happened, when, and how you became aware of it"
                  rows={5}
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.category}
                    onChange={handleInputChange as any}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="City, State, Country"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">When did this happen?</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organization">Organization Involved</Label>
                  <Input
                    id="organization"
                    name="organization"
                    placeholder="Company, Agency, etc."
                    value={formData.organization}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="individuals">Individuals Involved</Label>
                <Textarea
                  id="individuals"
                  name="individuals"
                  placeholder="List names and roles of people involved (if known)"
                  rows={2}
                  value={formData.individuals}
                  onChange={handleInputChange}
                />
              </div>

              <Alert className="bg-secondary border-secondary">
                <Lock className="h-4 w-4" />
                <AlertTitle>Privacy First</AlertTitle>
                <AlertDescription>
                  All reports are encrypted and can be submitted anonymously. Your security is our priority.
                </AlertDescription>
              </Alert>
            </div>

            <div className="pt-2 flex justify-end">
              <Button 
                onClick={nextStep} 
                className="gap-2"
              >
                Continue to Evidence <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 'evidence' && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Evidence & Contact Method</h2>
              <p className="text-muted-foreground">
                Upload any supporting evidence and choose how we should follow up
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-base">Upload Evidence (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center bg-secondary/50">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop files here, or click to browse
                  </p>
                  <Input
                    id="evidence"
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById('evidence')?.click()}
                    type="button"
                  >
                    Browse Files
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Supported formats: PDF, JPG, PNG, MP3, MP4, DOC, XLS (Max 10MB per file)
                  </p>
                </div>
              </div>

              {formData.files.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Files</Label>
                  <div className="space-y-2">
                    {formData.files.map((file, index) => (
                      <div 
                        key={index} 
                        className="flex items-center justify-between bg-secondary/50 rounded-md p-2"
                      >
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({(file.size / 1024).toFixed(0)} KB)
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeFile(index)}
                          className="h-7 w-7 p-0 rounded-full"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2">
                <Label className="text-base">Contact Method</Label>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="anonymous" 
                    checked={formData.anonymous} 
                    onCheckedChange={handleCheckboxChange}
                  />
                  <div className="space-y-1 leading-none">
                    <Label
                      htmlFor="anonymous"
                      className="text-sm font-medium cursor-pointer"
                    >
                      Submit report anonymously
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      You won't need to provide any identifying information
                    </p>
                  </div>
                </div>

                <RadioGroup 
                  value={formData.contactMethod}
                  onValueChange={(value) => handleRadioChange(value, 'contactMethod')}
                  className="space-y-3 pt-2"
                >
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="anonymousPortal" id="anonymousPortal" />
                    <div className="space-y-1 leading-none">
                      <Label
                        htmlFor="anonymousPortal"
                        className="text-sm font-medium cursor-pointer"
                      >
                        Use secure anonymous portal
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        You'll receive a secure tracking code to check for updates
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem 
                      value="secure-email" 
                      id="secure-email" 
                      disabled={formData.anonymous}
                    />
                    <div className="space-y-1 leading-none">
                      <Label
                        htmlFor="secure-email"
                        className={cn(
                          "text-sm font-medium cursor-pointer",
                          formData.anonymous && "text-muted-foreground"
                        )}
                      >
                        Secure email communication
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        We'll use encryption to protect your communications
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {!formData.anonymous && (
                <div className="space-y-4 animate-fade-in-quick">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name (Optional)</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Your Email (Optional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="For secure follow-up communications"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="additionalInfo">Additional Information</Label>
                <Textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  placeholder="Anything else we should know about this report?"
                  rows={3}
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                />
              </div>

              <Alert variant="destructive" className="bg-destructive/5 border-destructive/10">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  Never include information that could put yourself or others at risk. If you're in immediate danger, please contact appropriate authorities.
                </AlertDescription>
              </Alert>
            </div>

            <div className="pt-2 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
              >
                Back
              </Button>
              <Button 
                onClick={nextStep} 
                className="gap-2"
              >
                Review Report <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-bold">Review Your Report</h2>
              <p className="text-muted-foreground">
                Please review the information before submitting
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Report Details</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Title</p>
                    <p className="font-medium">{formData.title || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Category</p>
                    <p className="font-medium">{formData.category || 'Not selected'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Location</p>
                    <p className="font-medium">{formData.location || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Date of Incident</p>
                    <p className="font-medium">{formData.date || 'Not provided'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Organization</p>
                    <p className="font-medium">{formData.organization || 'Not provided'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm whitespace-pre-line">{formData.description || 'Not provided'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Individuals Involved</p>
                  <p className="text-sm">{formData.individuals || 'None specified'}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Evidence & Contact Info</h3>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Uploaded Files</p>
                  {formData.files.length > 0 ? (
                    <ul className="list-disc list-inside text-sm">
                      {formData.files.map((file, i) => (
                        <li key={i}>{file.name} ({(file.size / 1024).toFixed(0)} KB)</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">No files uploaded</p>
                  )}
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Report Type</p>
                  <p className="font-medium">{formData.anonymous ? 'Anonymous' : 'Non-anonymous'}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Contact Method</p>
                  <p className="font-medium">
                    {formData.contactMethod === 'anonymousPortal' 
                      ? 'Secure anonymous portal' 
                      : 'Secure email communication'}
                  </p>
                </div>
                
                {!formData.anonymous && (
                  <>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Name</p>
                      <p className="font-medium">{formData.name || 'Not provided'}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Email</p>
                      <p className="font-medium">{formData.email || 'Not provided'}</p>
                    </div>
                  </>
                )}
                
                {formData.additionalInfo && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Additional Information</p>
                    <p className="text-sm whitespace-pre-line">{formData.additionalInfo}</p>
                  </div>
                )}
              </div>
            </div>

            <Alert className="bg-secondary border-secondary">
              <Lock className="h-4 w-4" />
              <AlertTitle>Security Notice</AlertTitle>
              <AlertDescription>
                Your report will be encrypted and securely transmitted to our review team. 
                {formData.anonymous 
                  ? ' Your anonymity will be protected throughout the process.'
                  : ' Your personal information will be handled confidentially.'}
              </AlertDescription>
            </Alert>

            <div className="pt-2 flex justify-between">
              <Button 
                variant="outline" 
                onClick={prevStep}
              >
                Back
              </Button>
              <Button 
                onClick={submitReport} 
                className="gap-2"
              >
                Submit Report <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 'submitted' && (
          <div className="space-y-6 text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Report Submitted Successfully</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Thank you for coming forward. Your report has been securely transmitted to our review team.
              </p>
            </div>
            
            <div className="p-4 bg-secondary rounded-lg max-w-xs mx-auto">
              <p className="text-sm font-medium mb-1">Your Tracking Code</p>
              <p className="text-xl font-mono font-bold tracking-wider">WB-23791-XR</p>
              <p className="text-xs text-muted-foreground mt-2">
                Save this code to check your report status
              </p>
            </div>
            
            <div className="space-y-4 pt-4">
              <p className="text-sm">
                You can use this tracking code to check the status of your report and any responses from our team.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link to="/cases">
                    Track Your Report
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/">
                    Return to Home
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportForm;

const X = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
