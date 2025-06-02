import { Button } from "./components/ui/button";
import SignIn from "./pages/SignIn";

function App() {
  return (
    <>
      <Button>Click me</Button>
      <SignIn
        title="Phone verification"
        desc="Please enter your code that send to your phone"
        btnTitle="Submit"
        label="Code not receive?"
        actionLabel="Send again"
      />

      <SignIn
        title="Sign In"
        desc="Please enter your phone to sign in"
        btnTitle="Next"
        label="Don't having account?"
        actionLabel="Sign Up"
      />

      <SignIn
        title="Sign In"
        desc="Please enter your email to sign in"
        btnTitle="Next"
        label="Don't having account?"
        actionLabel="Sign Up"
      />

      <SignIn
        title="Email verification"
        desc="Please enter your code that send to your email address"
        btnTitle="Submit"
        label="Code not receive?"
        actionLabel="Send again"
      />
    </>
  );
}

export default App;
