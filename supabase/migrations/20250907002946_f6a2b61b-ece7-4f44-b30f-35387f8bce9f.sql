-- Create early access signups table
CREATE TABLE public.early_access_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  wants_newsletter BOOLEAN DEFAULT true,
  confirmed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(email)
);

-- Enable RLS
ALTER TABLE public.early_access_signups ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own signup"
ON public.early_access_signups
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create early access signup"
ON public.early_access_signups
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update their own signup"
ON public.early_access_signups
FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_early_access_signups_updated_at
BEFORE UPDATE ON public.early_access_signups
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_early_access_signups_email ON public.early_access_signups(email);
CREATE INDEX idx_early_access_signups_user_id ON public.early_access_signups(user_id);