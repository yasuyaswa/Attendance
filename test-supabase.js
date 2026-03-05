const { createClient } = require('@supabase/supabase-js');
const url = 'https://zhnyfqmdlpqxbpheumkd.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobnlmcW1kbHBxeGJwaGV1bWtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI3MDc4MzAsImV4cCI6MjA4ODI4MzgzMH0.jEBrFm94v9LB0WBmZFwKy22vkRSz9oLL8Fq-dv3MI-o';

(async ()=>{
  const supabase = createClient(url,key);
  const { data, error } = await supabase.from('attendance').select('*').limit(1);
  console.log('error', error);
  console.log('sample', data);
})();