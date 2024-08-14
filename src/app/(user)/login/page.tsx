import LoginForm from "@/app/(user)/login/components/LoginForm";
import {login} from "@/app/(user)/login/actions";

export default function LoginPage() {
  return <LoginForm credentialLoginAction={login} />;
}
