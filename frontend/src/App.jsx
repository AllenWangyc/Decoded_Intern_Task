import './App.css'
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import logo from './assets/logo.png'

function App() {

  return (
    <div>
      <AppBar position="static" color='transparent'>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            sx={{ mr: 2 }}
          >
            <img src={logo} alt="logo" style={{ width: 32, marginRight: 8 }} />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Decoded.
          </Typography>
          <Button variant="contained">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default App
