import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <div className="min-h-screen flex items-center justify-center">
      <SignIn
        afterSignInUrl="/"            // returning users → home
        afterSignUpUrl="/complete-profile"  // new users → profile page
      />
    </div>
}