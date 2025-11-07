import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Upload, Link as LinkIcon, Mail, Brain } from "lucide-react"
import {
  TextInputTab,
  FileUploadTab,
  URLInputTab,
  EmailInputTab,
  BatchInputTab,
} from "@/components/model-test"

/**
 * ModelTest page - allows testing messages for spam detection
 */
export function ModelTest() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          AI Spam Detection
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Test our advanced machine learning models with multiple input methods
        </p>
      </div>

      {/* Main Card */}
      <Card className="shadow-lg">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">Analyze Content</CardTitle>
          <CardDescription className="text-base">
            Choose your preferred input method and let our AI analyze it for spam
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs defaultValue="text" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="text" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Text</span>
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                <span className="hidden sm:inline">File</span>
              </TabsTrigger>
              <TabsTrigger value="url" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                <span className="hidden sm:inline">URL</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span className="hidden sm:inline">Email</span>
              </TabsTrigger>
              <TabsTrigger value="batch" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span className="hidden sm:inline">Batch</span>
              </TabsTrigger>
            </TabsList>

            {/* Text Input Tab */}
            <TabsContent value="text" className="space-y-4">
              <TextInputTab />
            </TabsContent>

            {/* File Upload Tab */}
            <TabsContent value="file" className="space-y-4">
              <FileUploadTab />
            </TabsContent>

            {/* URL Input Tab */}
            <TabsContent value="url" className="space-y-4">
              <URLInputTab />
            </TabsContent>

            {/* Email Input Tab */}
            <TabsContent value="email" className="space-y-4">
              <EmailInputTab />
            </TabsContent>

            {/* Batch Test Tab */}
            <TabsContent value="batch" className="space-y-4">
              <BatchInputTab />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Info Footer */}
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Powered by ensemble machine learning with 3 trained models</p>
        <p className="mt-1">Multinomial NB • Logistic Regression • Linear SVC</p>
      </div>
    </div>
  )
}
