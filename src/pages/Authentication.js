import { json, redirect } from "react-router-dom";
import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

export async function action({ request, params }) {
  const url = new URL(request.url).searchParams;
  const mode = url.get("mode") || "login";
 
  // if(mode !== "signup" || mode !== "login"){
  //   return json({message:"Unsupperted mode"}, {status:422})
  // }
  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const fetchData = await fetch(`http://localhost:8080/${mode}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(authData),
  });
 
  
  if (fetchData.status === 401 || fetchData.status === 422) {
    return fetchData;
  }
  
  if (!fetchData.ok) {
    return json({ message: "Authentication failed." }, { status: 500 });
  }
  
  const response = await fetchData.json();
  const authToken = response.token;
  localStorage.setItem("token", authToken);
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem('expiration', expiration.toISOString());


  return redirect("/");
}
