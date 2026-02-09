// Import of Box Material UI
import Box from "@mui/material/Box";

function listing_page(){
    return(

        // Master Container
        <Box>
            {/* Left side Box */}
            <Box sx={{
                display:'flex',
                flexDirection:{xs:'column', md:'row'}, // the responsiveness is made for the boxes the left and right
                bgcolor:'#F1F5F9',
                color:'#020617',
                p:2, // the spacing between the left and right boxes are given
                minHeight:'100vh'
            }}>
               
            </Box>

            {/* Right side Box */}
            <Box>

            </Box>
        </Box>
    )
}

export default listing_page;