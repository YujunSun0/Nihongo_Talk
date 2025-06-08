import LoginModal from "@/components/LoginModal";

export default function LoginPage() {
  return <LoginModal open={true} onClose={() => { window.location.href = "/"; }} />;
} 