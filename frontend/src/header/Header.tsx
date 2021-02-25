import {AppBar, Typography} from "@material-ui/core";
import './Header.css'

export function Header() {
    return (
        <AppBar position="static" className="header">
            <Typography variant="h4" component="h1" className="logo">
                Notes
            </Typography>
        </AppBar>
    )
}