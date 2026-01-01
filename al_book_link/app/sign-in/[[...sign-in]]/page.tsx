import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <div className="min-h-screen flex items-center justify-center">
    <SignIn
      forceRedirectUrl="/profile"            // returning users → profile to check completeness
      afterSignUpUrl="/profile"  // new users → profile page
    />
  </div>
}