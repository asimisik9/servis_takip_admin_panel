import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Box,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Autocomplete,
  Alert
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { fetchSchools } from '../services/schoolService';
import { fetchStudents } from '../services/studentService';
import { fetchBuses } from '../services/busService';
import { fetchUsers } from '../services/userService';

const AssignmentModal = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [assignmentType, setAssignmentType] = useState('student-bus'); // 'student-bus' or 'parent-student'

  // Data States
  const [schools, setSchools] = useState([]);
  const [students, setStudents] = useState([]);
  const [buses, setBuses] = useState([]);
  const [parents, setParents] = useState([]);

  // Selection States
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);

  // Loading States
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingParents, setLoadingParents] = useState(false);

  // Fetch schools when modal opens
  useEffect(() => {
    if (open) {
      loadSchools();
      loadParents(); // Load parents once or implement search later
    } else {
      // Reset states on close
      setSelectedSchool(null);
      setSelectedStudent(null);
      setSelectedBus(null);
      setSelectedParent(null);
      setStudents([]);
      setBuses([]);
      setAssignmentType('student-bus');
    }
  }, [open]);

  // Fetch data when school changes
  useEffect(() => {
    if (selectedSchool) {
      loadSchoolData(selectedSchool.id);
    } else {
      setStudents([]);
      setBuses([]);
      setSelectedStudent(null);
      setSelectedBus(null);
    }
  }, [selectedSchool]);

  const loadSchools = async () => {
    try {
      setLoadingSchools(true);
      const data = await fetchSchools(0, 100); // Fetch first 100 schools
      setSchools(data.items || []);

      // If only one school (e.g., admin role), select it automatically
      if (data.items && data.items.length === 1) {
        setSelectedSchool(data.items[0]);
      }
    } catch (error) {
      console.error('Error loading schools:', error);
    } finally {
      setLoadingSchools(false);
    }
  };

  const loadSchoolData = async (schoolId) => {
    try {
      setLoadingData(true);
      const [studentsData, busesData] = await Promise.all([
        fetchStudents(0, 1000, schoolId), // Fetch students for this school
        fetchBuses(0, 1000, schoolId)      // Fetch buses for this school
      ]);
      setStudents(studentsData.items || []);
      setBuses(busesData.items || []);
    } catch (error) {
      console.error('Error loading school data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadParents = async () => {
    try {
      setLoadingParents(true);
      // TODO: Implement proper parent search/pagination. For now limiting to 1000
      const data = await fetchUsers(0, 1000);
      const parentUsers = (data.items || []).filter(u => u.role === 'veli');
      setParents(parentUsers);
    } catch (error) {
      console.error('Error loading parents:', error);
    } finally {
      setLoadingParents(false);
    }
  };

  const handleTypeChange = (event, newType) => {
    if (newType !== null) {
      setAssignmentType(newType);
      // Optional: Reset selections when type changes?
      // setSelectedStudent(null);
      // setSelectedBus(null);
      // setSelectedParent(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (assignmentType === 'student-bus') {
      if (!selectedStudent || !selectedBus) return;
      onSubmit(assignmentType, {
        student_id: selectedStudent.id,
        bus_id: selectedBus.id
      });
    } else {
      if (!selectedStudent || !selectedParent) return;
      onSubmit(assignmentType, {
        student_id: selectedStudent.id,
        parent_id: selectedParent.id
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Yeni Atama</DialogTitle>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
            <ToggleButtonGroup
              value={assignmentType}
              exclusive
              onChange={handleTypeChange}
              aria-label="atama tipi"
              fullWidth
            >
              <ToggleButton value="student-bus" aria-label="öğrenci-otobüs">
                <DirectionsBusIcon sx={{ mr: 1 }} />
                Öğrenci-Otobüs
              </ToggleButton>
              <ToggleButton value="parent-student" aria-label="öğrenci-veli">
                <FamilyRestroomIcon sx={{ mr: 1 }} />
                Öğrenci-Veli
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* School Selection */}
          <Autocomplete
            options={schools}
            getOptionLabel={(option) => option.school_name || option.name || ''}
            value={selectedSchool}
            onChange={(event, newValue) => setSelectedSchool(newValue)}
            loading={loadingSchools}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Okul Seçiniz"
                margin="normal"
                required
                fullWidth
                helperText="Atama yapılacak okulu seçiniz"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loadingSchools ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />

          {!selectedSchool && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Lütfen işlem yapmak için önce bir okul seçiniz.
            </Alert>
          )}

          {/* Student Selection */}
          <Autocomplete
            options={students}
            getOptionLabel={(option) => `${option.full_name} (${option.student_number})`}
            value={selectedStudent}
            onChange={(event, newValue) => setSelectedStudent(newValue)}
            disabled={!selectedSchool || loadingData}
            loading={loadingData}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Öğrenci"
                margin="normal"
                required
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {loadingData ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
            sx={{ mt: 2 }}
            isOptionEqualToValue={(option, value) => option.id === value.id}
          />

          {assignmentType === 'student-bus' && (
            <Autocomplete
              options={buses}
              getOptionLabel={(option) => `${option.plate_number} (Kapasite: ${option.capacity})`}
              value={selectedBus}
              onChange={(event, newValue) => setSelectedBus(newValue)}
              disabled={!selectedSchool || loadingData}
              loading={loadingData}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Otobüs"
                  margin="normal"
                  required
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingData ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              sx={{ mt: 2 }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          )}

          {assignmentType === 'parent-student' && (
            <Autocomplete
              options={parents}
              getOptionLabel={(option) => `${option.full_name} (${option.email || option.phone_number})`}
              value={selectedParent}
              onChange={(event, newValue) => setSelectedParent(newValue)}
              loading={loadingParents}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Veli"
                  margin="normal"
                  required
                  fullWidth
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingParents ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              sx={{ mt: 2 }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          )}

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>İptal</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={
              !selectedSchool ||
              !selectedStudent ||
              (assignmentType === 'student-bus' && !selectedBus) ||
              (assignmentType === 'parent-student' && !selectedParent)
            }
          >
            Ata
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default AssignmentModal;
