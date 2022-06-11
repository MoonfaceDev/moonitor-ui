import React from "react";
import {Box, Icon, IconButton, InputBase, Paper, styled} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import useMobile from "../../Common/Hooks/Mobile";
import PanelContainer from "../../Components/Panel/PanelContainer";

const SearchPaper = styled(Paper)(({theme}) => ({
    background: theme.palette.primary.main,
    borderRadius: 8,
    boxShadow: 'unset'
}));

function SearchPanel({query, setQuery}: { query: string, setQuery: (query: string) => void }) {
    const isMobile = useMobile();
    return (
        <PanelContainer>
            <div style={{
                display: 'flex',
                padding: isMobile ? 8 : 16
            }}>
                <Box sx={{flex: 1}}>
                    <SearchPaper
                        sx={{p: '2px 4px', display: 'flex', alignItems: 'center'}}
                    >
                        <Icon sx={{p: '10px'}}>
                            <SearchIcon/>
                        </Icon>
                        <InputBase
                            fullWidth
                            value={query}
                            onChange={event => {
                                setQuery(event.target.value)
                            }}
                            placeholder='Search devices...'
                        />
                        {query.length > 0 ?
                            <IconButton sx={{p: '10px'}} onClick={() => {
                                setQuery('')
                            }}>
                                <ClearIcon/>
                            </IconButton> : null
                        }
                    </SearchPaper>
                </Box>
            </div>
        </PanelContainer>
    );
}

export default SearchPanel;