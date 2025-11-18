import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, FileText, Users, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

interface PrivacyPolicyScreenProps {
  onBack: () => void;
}

export function PrivacyPolicyScreen({ onBack }: PrivacyPolicyScreenProps) {
  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Button
            variant="ghost"
            onClick={onBack}
            className="p-2"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-3xl text-gray-900 dark:text-white">Privacy Policy</h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">How we protect and handle your data</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Introduction */}
          <Card>
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-xl text-gray-900 dark:text-white mb-4">Your Privacy Matters</h2>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    At ExpenseTracker, we are committed to protecting your privacy and ensuring the security of your personal and financial information. 
                    This privacy policy explains how we collect, use, and safeguard your data when you use our expense tracking platform.
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mt-4">
                    <strong>Last updated:</strong> December 25, 2024
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Information We Collect */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Information We Collect</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg text-gray-900 dark:text-white mb-2">Personal Information</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Name and email address when you create an account</li>
                  <li>• Phone number (optional) for account verification</li>
                  <li>• Profile information you choose to provide</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg text-gray-900 dark:text-white mb-2">Financial Data</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• Transaction records you manually enter</li>
                  <li>• Categories and budgets you create</li>
                  <li>• Income and expense patterns for analytics</li>
                </ul>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg text-gray-900 dark:text-white mb-2">Usage Information</h3>
                <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                  <li>• How you interact with our platform</li>
                  <li>• Device information and browser type</li>
                  <li>• Log files and analytics data</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* How We Use Your Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span>How We Use Your Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-gray-900 dark:text-white">Service Provision</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Provide expense tracking features</li>
                    <li>• Generate financial reports and insights</li>
                    <li>• Sync data across your devices</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-gray-900 dark:text-white">Communication</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Send account notifications</li>
                    <li>• Provide customer support</li>
                    <li>• Share product updates (optional)</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-gray-900 dark:text-white">Security & Compliance</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Prevent fraud and abuse</li>
                    <li>• Comply with legal requirements</li>
                    <li>• Protect user safety</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-gray-900 dark:text-white">Improvement</h4>
                  <ul className="space-y-1 text-gray-600 dark:text-gray-400 text-sm">
                    <li>• Analyze usage patterns</li>
                    <li>• Improve our services</li>
                    <li>• Develop new features</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Lock className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span>Data Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                We implement industry-standard security measures to protect your information:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-gray-900 dark:text-white mb-2">Encryption</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    All data is encrypted in transit and at rest using AES-256 encryption.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-gray-900 dark:text-white mb-2">Access Control</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Strict access controls and authentication mechanisms protect your data.
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className="text-gray-900 dark:text-white mb-2">Monitoring</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Continuous monitoring and security audits ensure system integrity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>Data Sharing</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="text-blue-900 dark:text-blue-100 mb-2">We do not sell your personal data</h4>
                <p className="text-blue-800 dark:text-blue-200 text-sm">
                  Your financial information is never sold to third parties for marketing or commercial purposes.
                </p>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400">
                We may share limited information only in these circumstances:
              </p>
              
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>• <strong>Service Providers:</strong> Trusted partners who help us operate our platform</li>
                <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                <li>• <strong>Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
                <li>• <strong>With Your Consent:</strong> When you explicitly authorize data sharing</li>
              </ul>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <span>Your Rights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="text-gray-900 dark:text-white">Access & Portability</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Request a copy of your data or export it to another service.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-gray-900 dark:text-white">Correction</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Update or correct any inaccurate personal information.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-gray-900 dark:text-white">Deletion</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Request deletion of your account and personal data.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-gray-900 dark:text-white">Opt-out</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Unsubscribe from marketing communications at any time.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-8">
              <h3 className="text-xl text-gray-900 dark:text-white mb-4">Questions About Privacy?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                If you have questions about this privacy policy or how we handle your data, please contact us:
              </p>
              
              <div className="space-y-2 text-gray-600 dark:text-gray-400">
                <p><strong>Email:</strong> privacy@expensetracker.com</p>
                <p><strong>Address:</strong> 123 Privacy Street, Data City, DC 12345</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
              </div>
              
              <div className="mt-6">
                <Button
                  onClick={onBack}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
                >
                  Back to Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}