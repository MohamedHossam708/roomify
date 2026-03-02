import { Box } from "lucide-react"
import { Link, useOutletContext } from "react-router"
import Button from "./ui/button";
import type { AuthContext } from "type";

const Navbar = () => {
  const {isSignedIn, userName , signIn , signOut}= useOutletContext<AuthContext>()

  let links = [
    { name: "Product", to: "#" },
    { name: "Pricing", to: "#" },
    { name: "Community", to: "#" },
    { name: "Enterprise", to: "#" },
  ]

  const handelAuthClick = async() => {
    // if sign is true proceed in logout logic else proceed in login logic

   if(isSignedIn){
    try {
      await signOut()
    } catch (error) {
      console.error("Puter logout faild ",error)
    }
    return
   }else{
    try {
      await signIn()
    } catch (error) {
      console.error("Puter login faild ",error)
    }

    return
   }
  }
  return (
    <header className='navbar'>
      <nav className='inner'>
        {/* left side */}
        <div className="left">
          <div className="brand">
            <Box className='logo'/>
            <span className="name">Roomify</span>
          </div>
            <ul className="links">
              {links.map((link) => (
                <li key={link.name}>
                  <Link to={link.to}>{link.name}</Link>
                </li>
              ))}
            </ul>
           
        </div>
         {/* Right side  */}

         <div className="actions">
          {/* if the user signed in or not */}
          {isSignedIn ? (<>
            <span className="greeting">
              {userName? `Hi, ${userName}` :  `Signed in`}
            </span>
            <Button size="sm" onClick={handelAuthClick} className="btn">
              Log Out
            </Button> 
            </>
          ):(
          <>
             <Button
             size="sm"
             variant="ghost"
              className="login"
              onClick={handelAuthClick}
              >Log In</Button>
              <Link to="/upload" className="cta">Get Started</Link>

          </>
          )}
             


            </div>

      </nav>
    </header>
  )
}

export default Navbar
