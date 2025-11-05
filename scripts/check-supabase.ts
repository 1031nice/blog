import { supabase } from '../lib/supabase'

async function checkSupabase() {
  console.log('Checking Supabase database...\n')
  
  // 포스트 확인
  const { data: posts, error: postsError } = await supabase
    .from('posts')
    .select('*')
  
  if (postsError) {
    console.error('Error fetching posts:', postsError)
    return
  }
  
  console.log(`Posts in database: ${posts?.length || 0}`)
  if (posts && posts.length > 0) {
    console.log('\nPosts:')
    posts.forEach((post: any) => {
      console.log(`- ${post.id}: ${post.title}`)
    })
  } else {
    console.log('No posts found in database.')
  }
  
  // About 확인
  const { data: about, error: aboutError } = await supabase
    .from('about')
    .select('*')
  
  if (aboutError && aboutError.code !== 'PGRST116') {
    console.error('Error fetching about:', aboutError)
  } else {
    console.log(`\nAbout records: ${about?.length || 0}`)
  }
}

checkSupabase().catch(console.error)

