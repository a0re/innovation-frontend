import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Settings, AlertTriangle, Eye, Layout, RotateCcw, Trash2 } from "lucide-react"
import { useSettings } from "@/contexts/SettingsContext"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { api } from "@/lib/api-service"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export function SettingsPage() {
  const { settings, updateSettings, resetSettings } = useSettings()
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteSuccess, setDeleteSuccess] = useState(false)

  const handleDeleteAll = async () => {
    setIsDeleting(true)
    setDeleteSuccess(false)
    try {
      await api.deleteAllPredictions()
      setDeleteSuccess(true)
      setTimeout(() => setDeleteSuccess(false), 3000)
    } catch (error) {
      console.error("Failed to delete predictions:", error)
      alert("Failed to delete predictions. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
          <Settings className="h-8 w-8" />
          Settings & Preferences
        </h1>
        <p className="text-muted-foreground">
          Customize your spam detection experience with personalized settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Confidence Threshold */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Confidence Threshold
            </CardTitle>
            <CardDescription>
              Adjust the minimum confidence level required for spam classification. Lower values
              are more sensitive, higher values are more conservative.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="threshold">Threshold: {settings.confidenceThreshold}%</Label>
                <span className="text-sm text-muted-foreground">
                  {settings.confidenceThreshold < 40
                    ? "Very Sensitive"
                    : settings.confidenceThreshold < 60
                      ? "Sensitive"
                      : settings.confidenceThreshold < 80
                        ? "Balanced"
                        : "Conservative"}
                </span>
              </div>
              <Slider
                id="threshold"
                value={[settings.confidenceThreshold]}
                onValueChange={([value]) =>
                  updateSettings({ confidenceThreshold: value })
                }
                min={0}
                max={100}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0% (Very Sensitive)</span>
                <span>50% (Default)</span>
                <span>100% (Very Conservative)</span>
              </div>
            </div>
            <Alert>
              <AlertDescription>
                Messages with confidence scores above this threshold will be classified as spam.
                The ensemble prediction uses this threshold when determining the final classification.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Model Toggles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layout className="h-5 w-5" />
              Active Models
            </CardTitle>
            <CardDescription>
              Enable or disable individual machine learning models. At least one model must be
              enabled for predictions to work.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="model-nb" className="text-base font-medium">
                    Multinomial Naive Bayes
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Fast and efficient probabilistic classifier
                  </p>
                </div>
                <Switch
                  id="model-nb"
                  checked={settings.models.multinomial_nb}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      models: { ...settings.models, multinomial_nb: checked },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="model-lr" className="text-base font-medium">
                    Logistic Regression
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Linear model with probabilistic outputs
                  </p>
                </div>
                <Switch
                  id="model-lr"
                  checked={settings.models.logistic_regression}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      models: { ...settings.models, logistic_regression: checked },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="model-svc" className="text-base font-medium">
                    Linear SVC
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Support Vector Classifier with balanced weights
                  </p>
                </div>
                <Switch
                  id="model-svc"
                  checked={settings.models.linear_svc}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      models: { ...settings.models, linear_svc: checked },
                    })
                  }
                />
              </div>
            </div>

            {!settings.models.multinomial_nb &&
              !settings.models.logistic_regression &&
              !settings.models.linear_svc && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    At least one model must be enabled. Please enable at least one model to use
                    predictions.
                  </AlertDescription>
                </Alert>
              )}
          </CardContent>
        </Card>

        {/* Display Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Display Preferences
            </CardTitle>
            <CardDescription>
              Customize what information is shown in prediction results
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="show-confidence" className="text-base font-medium">
                    Show Confidence Bar
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display the visual confidence progress bar
                  </p>
                </div>
                <Switch
                  id="show-confidence"
                  checked={settings.display.showConfidenceBar}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      display: { ...settings.display, showConfidenceBar: checked },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="show-models" className="text-base font-medium">
                    Show Individual Model Predictions
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display predictions from each model separately
                  </p>
                </div>
                <Switch
                  id="show-models"
                  checked={settings.display.showIndividualModels}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      display: { ...settings.display, showIndividualModels: checked },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="show-cluster" className="text-base font-medium">
                    Show Cluster Information
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display spam type classification and cluster details
                  </p>
                </div>
                <Switch
                  id="show-cluster"
                  checked={settings.display.showClusterInfo}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      display: { ...settings.display, showClusterInfo: checked },
                    })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="show-explanation" className="text-base font-medium">
                    Show Spam Explanation
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Display detailed explanation of why a message was flagged as spam
                  </p>
                </div>
                <Switch
                  id="show-explanation"
                  checked={settings.display.showSpamExplanation}
                  onCheckedChange={(checked) =>
                    updateSettings({
                      display: { ...settings.display, showSpamExplanation: checked },
                    })
                  }
                />
              </div>

            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Danger Zone
            </CardTitle>
            <CardDescription>
              Destructive actions that permanently modify your settings or data. Use with caution.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Reset Settings */}
            <div className="flex items-start justify-between p-4 rounded-lg border">
              <div className="space-y-1 flex-1">
                <Label className="text-base font-medium">Reset Settings</Label>
                <p className="text-sm text-muted-foreground">
                  Restore all settings to their default values
                </p>
              </div>
              <Button
                variant="outline"
                onClick={resetSettings}
                className="ml-4"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <Separator />

            {/* Delete All Predictions */}
            <div className="space-y-3">
              <div className="flex items-start justify-between p-4 rounded-lg border">
                <div className="space-y-1 flex-1">
                  <Label className="text-base font-medium">Delete All Predictions</Label>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete all prediction data from the database
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="ml-4" disabled={isDeleting}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? "Deleting..." : "Delete All"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete all prediction records from the database. This includes:
                        <ul className="list-disc list-inside mt-2 space-y-1">
                          <li>All prediction history</li>
                          <li>Statistics and analytics data</li>
                          <li>Trend information</li>
                          <li>Recent predictions</li>
                        </ul>
                        <p className="mt-3 font-semibold">This action cannot be undone.</p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAll}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Yes, Delete Everything
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {deleteSuccess && (
                <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    All predictions have been successfully deleted.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Backward-compatible export expected by route config
export { SettingsPage as Settings }

