import { withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Spinner from '../../components/Spinner';
import { ViewState, EditingState } from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  Resources,
  WeekView,
  MonthView,
  Appointments,
  AppointmentTooltip,
  AppointmentForm,
  Toolbar,
  TodayButton,
  DateNavigator,
  EditRecurrenceMenu,
  DragDropProvider,
} from '@devexpress/dx-react-scheduler-material-ui';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Layout from '../../components/Layout/Layout';
import { showErrorToast, showSuccessToast } from '../../components/Toast';

export async function getServerSideProps() {
  // Get all rooms
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/rooms/get-all-rooms`
  );
  const rooms = res.data;

  // Get all department
  const departmentRes = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/departments/list-department`
  );
  const departments = departmentRes.data;

  // Get all appointments
  const appointmentRes = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/appointments/get-all-appointments`
  );
  const appointments = appointmentRes.data;

  return {
    props: {
      rooms,
      departments,
      appointments,
    },
  };
}

const PREFIX = 'ResourcesPage';

const classes = {
  container: `${PREFIX}-container`,
  text: `${PREFIX}-text`,
};

const StyledDiv = styled('div')(({ theme }) => ({
  [`&.${classes.container}`]: {
    display: 'flex',
    marginBottom: theme.spacing(2),
    justifyContent: 'flex-end',
  },
  [`&.${classes.text}`]: {
    ...theme.typography.h6,
    marginRight: theme.spacing(2),
  },
}));

const Appointment = ({ children, style, ...restProps }) => (
  <Appointments.Appointment
    {...restProps}
    style={{
      ...style,
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#fff',
    }}
  >
    {children}
  </Appointments.Appointment>
);

const ResourceSwitcher = ({ mainResourceName, onChange, resources }) => (
  <StyledDiv className={classes.container}>
    <div className={classes.text}>Main resource name:</div>
    <Select
      variant="standard"
      value={mainResourceName}
      onChange={(e) => onChange(e.target.value)}
    >
      {resources.map((resource) => (
        <MenuItem key={resource.fieldName} value={resource.fieldName}>
          {resource.title}
        </MenuItem>
      ))}
    </Select>
  </StyledDiv>
);

const ExternalViewSwitcher = ({ currentViewName, onChange }) => (
  <RadioGroup
    aria-label="Views"
    style={{ flexDirection: 'row' }}
    name="views"
    value={currentViewName}
    onChange={onChange}
  >
    <FormControlLabel value="Week" control={<Radio />} label="Week" />
    <FormControlLabel value="Month" control={<Radio />} label="Month" />
  </RadioGroup>
);

class ResourcesPage extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      currentViewName: 'Week',

      data: props.appointments.map((appointment) => {
        return {
          ...appointment,
          startDate: new Date(appointment.startDate),
          endDate: new Date(appointment.endDate),
          id: appointment._id,
        };
      }),

      mainResourceName: 'location',
      resources: [
        {
          fieldName: 'location',
          title: 'Phòng',
          instances: props.rooms.map((room) => {
            return { id: room._id, text: room.name };
          }),
        },
        {
          fieldName: 'members',
          title: 'Tham gia',
          allowMultiple: true,
          instances: props.departments.map((department) => {
            return { id: department._id, text: department.name };
          }),
        },
      ],
    };

    this.commitChanges = this.commitChanges.bind(this);

    this.changeMainResource = this.changeMainResource.bind(this);

    this.currentViewNameChange = (e) => {
      this.setState({ currentViewName: e.target.value });
    };
  }

  changeMainResource(mainResourceName) {
    this.setState({ mainResourceName });
  }

  commitChanges({ added, changed, deleted }) {
    this.setState(async (state) => {
      let { data } = state;
      if (added) {
        console.log(added);
        // Add new appointment to database
        try {
          const res = await axios.post(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/appointments/create`,
            {
              ...added,
            }
          );

          // Get the new appointment
          const newAppointment = res.data;

          // Add new appointment to state
          data = [...data, { ...added, id: newAppointment._id }];

          showSuccessToast('Thêm lịch họp thành công');
        } catch (err) {
          showErrorToast(err.response.data.message);
        }
      }
      if (changed) {
        data = data.map((appointment) =>
          changed[appointment.id]
            ? { ...appointment, ...changed[appointment.id] }
            : appointment
        );
        console.log(changed);

        const [id, updatedData] = Object.entries(changed)[0];

        // Update appointment in database
        const res = await axios.patch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/appointments/update`,
          {
            id,
            updatedData,
          }
        );

        if (res.status !== 200) showErrorToast('Cập nhật lịch họp thất bại');
        showSuccessToast('Cập nhật lịch họp thành công');
      }
      if (deleted !== undefined) {
        data = data.filter((appointment) => appointment.id !== deleted);
        // Delete appointment in database
        const res = await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/appointments/delete`,
          {
            params: {
              id: deleted,
            },
          }
        );

        if (res.status !== 200) showErrorToast('Xóa lịch họp thất bại');
        showSuccessToast('Xóa lịch họp thành công');
      }
      // reload page
      // window.location.reload();
      return { data };
    });
  }

  componentDidMount() {
    // Get user profile
    const getUserProfile = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/get-user-info?email=${this.props.user.email}`
      );

      this.setState({ userProfile: res.data });
      this.setState({ loading: false });
    };

    getUserProfile();
  }

  render() {
    const {
      data,
      resources,
      mainResourceName,
      currentViewName,
      userProfile,
      loading,
    } = this.state;

    if (loading) return <Spinner />;

    return (
      <Layout user={this.props.user}>
        <h1 className="mb-10 text-2xl font-bold">Lịch phòng họp</h1>
        <React.Fragment>
          <div className="flex justify-between items-center">
            <ResourceSwitcher
              resources={resources}
              mainResourceName={mainResourceName}
              onChange={this.changeMainResource}
            />

            <ExternalViewSwitcher
              currentViewName={currentViewName}
              onChange={this.currentViewNameChange}
            />
          </div>

          <Paper>
            <Scheduler data={data}>
              <ViewState
                defaultCurrentDate={Date.now()}
                currentViewName={currentViewName}
              />
              {userProfile?.user_metadata?.role && (
                <EditingState onCommitChanges={this.commitChanges} />
              )}
              {userProfile?.user_metadata?.role && <EditRecurrenceMenu />}
              <WeekView startDayHour={8} endDayHour={17} />
              <MonthView />
              <Appointments appointmentComponent={Appointment} />
              {userProfile?.user_metadata?.role ? (
                <AppointmentTooltip
                  showOpenButton
                  showCloseButton
                  showDeleteButton
                />
              ) : (
                <AppointmentTooltip showOpenButton />
              )}
              <AppointmentForm />
              <Resources data={resources} mainResourceName={mainResourceName} />
              <Toolbar />
              <DateNavigator />
              <TodayButton />
              {userProfile?.user_metadata?.role && <DragDropProvider />}
            </Scheduler>
          </Paper>
        </React.Fragment>
      </Layout>
    );
  }
}

export default withPageAuthRequired(ResourcesPage);
