import React, { Component } from 'react';
import { connect } from "react-redux";
import './BookingModal.scss';
import { FormattedMessage } from 'react-intl';
import { Modal } from 'reactstrap';
import ProfileDoctor from '../ProfileDoctor';
import _ from 'lodash';
import DatePicker from '../../../../components/Input/DatePicker';
import * as actions from '../../../../store/actions';
import { LANGUAGES } from '../../../../utils';
import Select from "react-select";
import { postPatientBookingService } from '../../../../services/userService';
import { toast } from 'react-toastify';
import moment from 'moment';
import LoadingOverlay from 'react-loading-overlay';

class BookingModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            phoneNumber: '',
            email: '',
            address: '',
            reason: '',
            birthday: '',
            selectedGender: '',
            doctorId: '',
            genders: [],
            timeType: '',
            isShowLoading: false,
        };
    }

    async componentDidMount() {
        this.props.getGenders();
        this.updateDefaultInfo();
    }

    componentDidUpdate(prevProps) {
        if (this.props.language !== prevProps.language) {
            this.updateGenderOptions();
        }
        if (this.props.genders !== prevProps.genders) {
            this.updateGenderOptions();
        }
        if (this.props.userInfo !== prevProps.userInfo) {
            this.updateDefaultInfo();
        }
        if (this.props.dataTime !== prevProps.dataTime) {
            this.updateDataTimeInfo();
        }
    }

    updateGenderOptions = () => {
        const { genders, language } = this.props;
        if (genders && genders.length > 0) {
            const formattedGenders = genders.map(item => ({
                label: language === LANGUAGES.VI ? item.valueVi : item.valueEn,
                value: item.keyMap,
            }));
            this.setState({ genders: formattedGenders });
        }
    };

    updateDefaultInfo = () => {
        const { userInfo } = this.props;
        if (userInfo) {
            this.setState({
                fullName: userInfo.firstName || '',
                phoneNumber: userInfo.phoneNumber || '',
                email: userInfo.email || '',
                address: userInfo.address || '',
            });
        }
    };

    updateDataTimeInfo = () => {
        const { dataTime } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            this.setState({
                doctorId: dataTime.doctorId,
                timeType: dataTime.timeType,
            });
        }
    };

    handleOnChangeInput = (event, id) => {
        this.setState({ [id]: event.target.value });
    };

    handleOnchangeDatePicker = (date) => {
        this.setState({ birthday: date[0] });
    };

    handleChangeSelect = (selectedOption) => {
        this.setState({ selectedGender: selectedOption });
    };

    buildTimeBooking = () => {
        const { dataTime, language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            const time = language === LANGUAGES.VI
                ? dataTime.timeTypeData.valueVi
                : dataTime.timeTypeData.valueEn;
            const date = language === LANGUAGES.VI
                ? moment.unix(+dataTime.date / 1000).format('dddd - DD/MM/YYYY')
                : moment.unix(+dataTime.date / 1000).locale('en').format('ddd - MM/DD/YYYY');
            return `${time} - ${date}`;
        }
        return '';
    };

    buildDoctorName = () => {
        const { dataTime, language } = this.props;
        if (dataTime && !_.isEmpty(dataTime)) {
            const { firstName, lastName } = dataTime.doctorData;
            return language === LANGUAGES.VI
                ? `${lastName} ${firstName}`
                : `${firstName} ${lastName}`;
        }
        return '';
    };

    handleConfirmBooking = async () => {
        this.setState({ isShowLoading: true });
        const { dataTime, language } = this.props;
        const { fullName, phoneNumber, email, address, reason, birthday, selectedGender, doctorId, timeType } = this.state;
        const bookingData = {
            fullName,
            phoneNumber,
            email,
            address,
            reason,
            birthday: new Date(birthday).getTime(),
            doctorId,
            timeType,
            language,
            date: dataTime.date,
            timeString: this.buildTimeBooking(),
            doctorName: this.buildDoctorName(),
            selectedGender: selectedGender.value,
        };

        try {
            const response = await postPatientBookingService(bookingData);
            if (response && response.errCode === 0) {
                toast.success(<FormattedMessage id="patient.booking-modal.success" />);
                this.props.closeBookingModal();
            } else {
                toast.error(response.errMessage || <FormattedMessage id="patient.booking-modal.error" />);
            }
        } catch (error) {
            toast.error(<FormattedMessage id="patient.booking-modal.error" />);
        } finally {
            this.setState({ isShowLoading: false });
        }
    };

    render() {
        const { isOpenModal, closeBookingModal, dataTime } = this.props;
        const { fullName, phoneNumber, email, address, reason, birthday, genders, selectedGender, isShowLoading } = this.state;

        return (
            <LoadingOverlay active={isShowLoading} spinner text="Loading...">
                <Modal
                    isOpen={isOpenModal}
                    className="booking-modal-container"
                    size="lg"
                    centered
                >
                    <div className="booking-modal-content">
                        <div className="booking-modal-header">
                            <span className="left"><FormattedMessage id="patient.booking-modal.title" /></span>
                            <span className="right" onClick={closeBookingModal}><i className="fas fa-times"></i></span>
                        </div>
                        <div className="booking-modal-body">
                            <div className="doctor-info">
                                <ProfileDoctor
                                    doctorId={dataTime?.doctorId}
                                    dataTime={dataTime}
                                    isShowDescDoctor={false}
                                    isShowLinkDetail={false}
                                    isShowPrice={true}
                                />
                            </div>
                            <div className="row">
                                <div className="col-6 form-group">
                                    <label><FormattedMessage id="patient.booking-modal.fullName" /></label>
                                    <input className="form-control" value={fullName} onChange={(e) => this.handleOnChangeInput(e, 'fullName')} />
                                </div>
                                <div className="col-6 form-group">
                                    <label><FormattedMessage id="patient.booking-modal.phoneNumber" /></label>
                                    <input className="form-control" value={phoneNumber} onChange={(e) => this.handleOnChangeInput(e, 'phoneNumber')} />
                                </div>
                                <div className="col-6 form-group">
                                    <label><FormattedMessage id="patient.booking-modal.email" /></label>
                                    <input className="form-control" value={email} onChange={(e) => this.handleOnChangeInput(e, 'email')} />
                                </div>
                                <div className="col-6 form-group">
                                    <label><FormattedMessage id="patient.booking-modal.address" /></label>
                                    <input className="form-control" value={address} onChange={(e) => this.handleOnChangeInput(e, 'address')} />
                                </div>
                                <div className="col-12 form-group">
                                    <label><FormattedMessage id="patient.booking-modal.reason" /></label>
                                    <input className="form-control" value={reason} onChange={(e) => this.handleOnChangeInput(e, 'reason')} />
                                </div>
                                <div className="col-6 form-group">
                                    <label><FormattedMessage id="patient.booking-modal.birthday" /></label>
                                    <DatePicker onChange={this.handleOnchangeDatePicker} value={birthday} className="form-control" />
                                </div>
                                <div className="col-6 form-group">
                                    <label><FormattedMessage id="patient.booking-modal.gender" /></label>
                                    <Select value={selectedGender} onChange={this.handleChangeSelect} options={genders} />
                                </div>
                            </div>
                        </div>
                        <div className="booking-modal-footer">
                            <button className="btn btn-primary btn-booking-confirm" onClick={this.handleConfirmBooking}>
                                <FormattedMessage id="patient.booking-modal.btn-confirm" />
                            </button>
                            <button className="btn btn-danger btn-booking-cancel" onClick={closeBookingModal}>
                                <FormattedMessage id="patient.booking-modal.btn-cancel" />
                            </button>
                        </div>
                    </div>
                </Modal>
            </LoadingOverlay>
        );
    }
}

const mapStateToProps = (state) => ({
    language: state.app.language,
    genders: state.admin.genders,
    userInfo: state.user.userInfo,
});

const mapDispatchToProps = (dispatch) => ({
    getGenders: () => dispatch(actions.fetchGenderStart()),
});

export default connect(mapStateToProps, mapDispatchToProps)(BookingModal);
