import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Building2, 
  Mail, 
  Phone,
  Save,
  Camera,
  Settings
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface Profile {
  id: string;
  business_name: string | null;
  email: string | null;
  phone: string | null;
}

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    business_name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }

      if (data) {
        setProfile(data);
        setFormData({
          business_name: data.business_name || '',
          email: data.email || user?.email || '',
          phone: data.phone || ''
        });
      } else {
        // Create new profile if none exists
        setFormData({
          business_name: '',
          email: user?.email || '',
          phone: ''
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (profile) {
        // Update existing profile
        const { error } = await supabase
          .from('profiles')
          .update(formData)
          .eq('id', profile.id);

        if (error) throw error;
      } else {
        // Create new profile
        const { error } = await supabase
          .from('profiles')
          .insert([{
            ...formData,
            user_id: user?.id
          }]);

        if (error) throw error;
      }

      toast.success('Profile updated successfully');
      fetchProfile(); // Refresh the profile data
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 handwritten">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and business information</p>
        </div>

        {/* Profile Picture Section */}
        <Card className="craft-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-teal" />
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-teal" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-craft-orange rounded-full flex items-center justify-center text-white shadow-lg hover:bg-craft-brown transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-medium text-gray-900">{user?.email}</h3>
                <p className="text-sm text-gray-600 mt-1">Click the camera icon to update your profile picture</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Camera className="w-4 h-4 mr-2" />
                  Change Photo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card className="craft-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-craft-orange" />
              Business Information
              <svg className="absolute -bottom-1 left-0 w-full h-2" viewBox="0 0 100 8" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 5 Q 50 1 98 4" stroke="#e67e22" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              </svg>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="business_name">Business Name</Label>
              <Input
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                placeholder="Your craft business name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your@email.com"
                  className="pl-10 mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                  className="pl-10 mt-1"
                />
              </div>
            </div>

            <Button 
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-teal hover:bg-teal-dark"
            >
              {saving ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="craft-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-teal" />
              Account Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Account Status</h4>
                <p className="text-sm text-gray-600">Your account is active and verified</p>
              </div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Data Export</h4>
                <p className="text-sm text-gray-600">Download your inventory data</p>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>

            <div className="border-t pt-4">
              <Button 
                variant="destructive" 
                onClick={handleSignOut}
                className="w-full"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}