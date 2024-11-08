import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TextField,
  TablePagination,
  MenuItem,
  Box,
} from '@mui/material';

function Attendance() {
  const Token = localStorage.getItem('authToken');
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [batchFilter, setBatchFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const studentId = localStorage.getItem('id');

  useEffect(() => {
    if (studentId) {
      axios.get(`https://crpch.in/api/ka/student/take_attendance/?id=${studentId}`, {
        headers: {
          Authorization: `Token ${Token}`,
        },
      })
        .then(response => {
          if (response.data.status) {
            setAttendanceData(response.data.table_data);
            setFilteredData(response.data.table_data);
          }
        })
        .catch(error => {
          console.error("Error fetching attendance data:", error);
        });
    }
  }, [studentId]);

  useEffect(() => {
    let filtered = attendanceData.filter(record => {
      const nameMatch = record.student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const regNoMatch = record.student.reg_no.toLowerCase().includes(searchTerm.toLowerCase());
      const dateMatch = dateFilter ? record.date === dateFilter : true;
      const courseMatch = courseFilter ? record.student.COURSE.COURSE_name === courseFilter : true;
      const batchMatch = batchFilter ? record.student.BATCH.BATCH_name === batchFilter : true;

      return (nameMatch || regNoMatch) && dateMatch && courseMatch && batchMatch;
    });
    setFilteredData(filtered);
  }, [searchTerm, dateFilter, courseFilter, batchFilter, attendanceData]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <Typography variant="h4" component="h2" style={{ marginBottom: '20px', fontWeight: 'bold' }}>
        View Attendance
      </Typography>

      <hr style={{ width: '100%', maxWidth: '800px', marginBottom: '20px', borderColor: '#222' }} />

      {/* Search Function Text */}
      <Typography variant="small" style={{ marginBottom: '10px', textAlign: 'left', width: '100%', maxWidth: '800px' }}>
        Search Functionality
      </Typography>

      {/* Updated Filter Section */}
      <Box
        display="flex"
        gap="15px"
        flexWrap="wrap"
        marginBottom="20px"
        width="100%"
        maxWidth="800px"
        justifyContent="center"
      >
        <TextField
          label="Search by Name or Reg No"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: '1', minWidth: '180px', backgroundColor: '#fff', borderRadius: '4px' }}
        />
        <TextField
          label="Date"
          variant="outlined"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          InputLabelProps={{ shrink: true }}
          style={{ flex: '1', minWidth: '120px', backgroundColor: '#fff', borderRadius: '4px' }}
        />
        <TextField
          label="Course"
          variant="outlined"
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          select
          style={{ flex: '1', minWidth: '120px', backgroundColor: '#fff', borderRadius: '4px' }}
        >
          {[...new Set(attendanceData.map(record => record.student.COURSE.COURSE_name))].map(course => (
            <MenuItem key={course} value={course}>
              {course}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Batch"
          variant="outlined"
          value={batchFilter}
          onChange={(e) => setBatchFilter(e.target.value)}
          select
          style={{ flex: '1', minWidth: '120px', backgroundColor: '#fff', borderRadius: '4px' }}
        >
          {[...new Set(attendanceData.map(record => record.student.BATCH.BATCH_name))].map(batch => (
            <MenuItem key={batch} value={batch}>
              {batch}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer component={Paper} style={{ width: '100%', maxWidth: '800px' }}>
        <Table>
          <TableHead style={{ backgroundColor: '#222' }}>
            <TableRow>
              <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Registration No</TableCell>
              <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Date</TableCell>
              <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Batch Name</TableCell>
              <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Course Name</TableCell>
              <TableCell align="center" style={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((record) => (
              <TableRow key={record.id}>
                <TableCell align="center" style={{ color: record.attend ? 'green' : 'red' }}>{record.student.reg_no}</TableCell>
                <TableCell align="center" style={{ color: record.attend ? 'green' : 'red' }}>{record.student.name}</TableCell>
                <TableCell align="center" style={{ color: record.attend ? 'green' : 'red' }}>{record.date}</TableCell>
                <TableCell align="center" style={{ color: record.attend ? 'green' : 'red' }}>{record.student.BATCH.BATCH_name}</TableCell>
                <TableCell align="center" style={{ color: record.attend ? 'green' : 'red' }}>{record.student.COURSE.COURSE_name}</TableCell>
                <TableCell align="center" style={{ color: record.attend ? 'green' : 'red' }}>
                  {record.attend ? 'Present' : 'Absent'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        style={{ marginTop: '20px' }}
      />
    </div>
  );
}

export default Attendance;
