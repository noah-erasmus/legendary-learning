import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableBody from '@material-ui/core/TableBody';
import TableContainer from '@material-ui/core/TableContainer';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import Typography from '@material-ui/core/Typography';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
// import { DetailsModal } from './DetailsModal';
import { Modal } from '@material-ui/core';
import { Details } from './Details'

function createData(subject, slot, group, classroom) {
    return { subject, slot, group, classroom };
}



const useStyles = makeStyles({
    table: {
        minWidth: 650,

    },
    paper: {
        position: 'absolute',
        width: 1200,
        height: 800,
        border: '2px solid #0000',
        backgroundColor: 'white'
    }
});



export const Timetable = () => {
    const classes = useStyles();
    const [classesData, setClassesData] = useState([
        { id: 1, slot: 3, subject: "Grade 10 English", group: 1, classroom: "A1" },
        { id: 2, slot: 2, subject: "Grade 10 English", group: 2, classroom: "C1" },
        { id: 3, slot: 1, subject: "Grade 10 Afrikaans", group: 1, classroom: "A2" },
        { id: 4, slot: 5, subject: "Grade 10 Afrikaans", group: 2, classroom: "C2" },
        { id: 5, slot: 4, subject: "Grade 10 History", group: 1, classroom: "Hall" },
        { id: 6, slot: 2, subject: "Grade 10 Mathematics", group: 1, classroom: "B1" }
    ]);
    const [slotsData, setSlotsData] = useState([]);
    const [studentNo, setStudentNo] = useState();
    const [classState, setClassState] = useState();


    useEffect(() => {
        console.log('This component rendered.');
        // axios('http://localhost:8000/api/classes/learners/:learnerId')
        //     .then(response => {
        //         return response;
        //     })
        //     .then(data => {
        //         setTableData(data.data);
        //     })
        //     .catch(err => {
        //         console.log(`There was an error ${err}`);
        //     });


    }, []);

    const getTimes = () => {
        axios('http://localhost:8000/api/slots')
            .then(response => {
                return response;
            })
            .then(data => {
                setSlotsData(data.data);
            })
            .catch(err => {
                console.log(`There was an error ${err}`);
            });

        // return (
        //     <Container>
        //         <p>Mon: {times[0].period}</p>
        //         <p>Tue: {times[1].period}</p>
        //         <p>Wed: {times[2].period}</p>
        //         <p>Thu: {times[3].period}</p>
        //         <p>Fri: {times[4].period}</p>
        //     </Container>
        // )
    }



    const rows = [
        createData(classesData[0].subject, classesData[0].slot, classesData[0].group, classesData[0].classroom),
        createData(classesData[1].subject, classesData[1].slot, classesData[1].group, classesData[1].classroom),
        createData(classesData[2].subject, classesData[2].slot, classesData[2].group, classesData[2].classroom),
        createData(classesData[3].subject, classesData[3].slot, classesData[3].group, classesData[3].classroom),
        createData(classesData[4].subject, classesData[4].slot, classesData[4].group, classesData[4].classroom),
        createData(classesData[5].subject, classesData[5].slot, classesData[5].group, classesData[5].classroom)
    ];

    const submitNo = () => {
        axios(`http://localhost:8000/api/classes/learners/${studentNo}`)
            .then(response => {
                return response;
            })
            .then(data => {
                setClassesData(data.data);
            })
            .catch(err => {
                console.log(`There was an error ${err}`);
            });

    }

    const onNumberChange = (e) => {
        setStudentNo(e.target.value);
    }

    const DetailsModal = (lesson) => {
        const classes = useStyles();
        const [open, setOpen] = React.useState(false);

        const handleOpen = () => {
            setOpen(true);
        };

        const handleClose = () => {
            setOpen(false);
        };

        const body = (
            <div className={classes.paper}>
                <h2>{lesson.subject}</h2>
                <h3>Classroom:</h3>
                <p>{lesson.classroom}</p>
                <h3>Slot:</h3>
                <p>{lesson.slot}</p>
                <p>
                </p>
                <h3>Group:</h3>
                <p>{lesson.group}</p>
            </div>
        );

        return (
            <div>
                <button type="button" onClick={handleOpen}>
                    View details
          </button>
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    {body}
                </Modal>
            </div>
        );
    }


    return (
        <Container>
            <form>
                <TextField onChange={e => onNumberChange(e)} id="standard-basic" label="Enter student number"></TextField>
            </form>
            <Button onClick={() => submitNo()} variant="contained">Go</Button>


            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Subject</TableCell>
                            <TableCell align="right">Slot</TableCell>
                            <TableCell align="right">Group</TableCell>
                            <TableCell align="right">Classroom</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.subject}>
                                <TableCell component="th" scope="row">
                                    {row.subject}
                                </TableCell>
                                <TableCell align="right">{row.slot}</TableCell>
                                <TableCell align="right">{row.group}</TableCell>
                                <TableCell align="right">{row.classroom}</TableCell>
                                <TableCell align="right">
                                    {DetailsModal(row)}
                                    {/* <Link to={{
                                        pathname: `/classDetails/${row.subject}`,
                                        // state: {
                                        //     classId: row.subject
                                        // }
                                    }}>View details</Link> */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
        <Container>
            <form>
                <TextField onChange={e => onNumberChange(e)} id="standard-basic" label="Enter student number"></TextField>
            </form>
            <Button onClick={() => submitNo()} variant="contained">Go</Button>
            <Grid container spacing={5}>
                <Grid item>
                    <Typography variant="h5" gutterBottom>
                        Time
                    </Typography>

                </Grid>
                <Grid item>
                    <div>
                        <Typography variant="h4" gutterBottom>
                            Monday
                        </Typography>
                        <div>

                        </div>

                    </div>

                </Grid>
                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        Tuesday
                    </Typography>

                </Grid>
                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        Wednesday
                    </Typography>

                </Grid>
                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        Thursday
                    </Typography>

                </Grid>
                <Grid item>
                    <Typography variant="h4" gutterBottom>
                        Friday
                    </Typography>

                </Grid>
            </Grid>
        </Container>
    );
}