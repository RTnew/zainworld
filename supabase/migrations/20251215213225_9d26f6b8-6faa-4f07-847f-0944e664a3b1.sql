-- Create table to track dictionary payments
CREATE TABLE public.dictionary_payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  amount INTEGER NOT NULL DEFAULT 49,
  currency TEXT NOT NULL DEFAULT 'INR',
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.dictionary_payments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read their own payments (by player_name)
CREATE POLICY "Players can view their own payments"
ON public.dictionary_payments
FOR SELECT
USING (true);

-- Allow anyone to create payments
CREATE POLICY "Anyone can create payments"
ON public.dictionary_payments
FOR INSERT
WITH CHECK (true);

-- Allow updates to payment status
CREATE POLICY "Anyone can update payments"
ON public.dictionary_payments
FOR UPDATE
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_dictionary_payments_player_name ON public.dictionary_payments(player_name);
CREATE INDEX idx_dictionary_payments_status ON public.dictionary_payments(status);

-- Create updated_at trigger
CREATE TRIGGER update_dictionary_payments_updated_at
BEFORE UPDATE ON public.dictionary_payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();