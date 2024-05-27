<template>
  <div v-if="loaderFlage" id="global-loader" style="position: absolute; left: 0; right: 0; text-align: center; top: 37%; margin: 0 auto;">
    <img :src="LOADER" alt="loader">
  </div>
  <div class="container-xl pt-5">
    <div class="row">
      <div class="col-lg-12 col-md-12">
        <div class="card mb-5 cBlue">
          <div class="card-header">
            <h4 class="card-title">Units</h4>
            <button v-if="(APP_NATURE == 'on_site' && IS_ACCESS_CONTROL_ROGER == true && ENABLE_MEMBERSHIPS == true)"
              type="button" class="btn btn-outline-success ml-auto" id="btn-sync"
              @click="openBarrier(VIP_ENTRY_ID);">Open VIP Entry <i class="fa fa-car"></i></button>
            <button v-if="(APP_NATURE == 'on_site' && IS_ACCESS_CONTROL_ROGER == true && ENABLE_MEMBERSHIPS == true)"
              type="button" class="btn btn-outline-success ml-auto" id="btn-sync" @click="openBarrier(VIP_EXIT_ID);">
              Open VIP Exit <i class="fa fa-car"></i></button>
            <button v-if="(APP_NATURE == 'on_site' && IS_ACCESS_CONTROL_ROGER == true && ENABLE_MEMBERSHIPS == true)"
              type="button" class="btn btn-outline-success ml-auto" id="btn-sync"
              @click="openBarrier(POS_EXIT_ID);">Open POS Exit <i class="fa fa-car"></i></button>
            <div class="form-group card-select" v-if="siteList">
              <select class="form-control select2" style="width:100%; padding:5px;" v-model="site_id"
                @change="changeSiteId">
                <option :value="site.id" v-for="site in siteList">{{ site.text }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
<div class="row" style="padding: 40px;">
      <circle-progress :percent="40" />

</div>
    <div class="row">
      <div v-for="(unit, index) in unitList" :key="index" class="col-lg-4wsd col-sm-6 col-12  mb-3">
        <div class="bgGray card rounded-3 text-white p-3 position-relative" :id="unit.id + '_unit'">
          <span class="pulse-unit" :class="{ 'green': unit.status == 'Online' }"></span>
          <div style="z-index: 1;">
            <div class="position-relative">
              <h4 class="fw-bold text-center mb-3">{{ unit.name }}</h4>
              <a v-if="unit.rtsp_url != nul" style="color: #fff;" title="Live Cam" :data-id="unit.id"
                class="position-absolute top-0 end-0" @click="openWindow(`http://${unit.ip}:${unit.port}/open-camera`)">
                <i class="fa fa-video-camera fa-lg"></i>
                <span class="cam-pulse"></span>
              </a>
            </div>
            <div class="row mb-3">
              <div class="col-12 col-md-6">
                <p class="mb-0 text-start fs-5 ">Available Tickets: <span class="fw-bod "
                    :class="{ 'text-white': unit.tickets > unit.min_tickets, 'text-warning': unit.tickets <= unit.min_tickets }">{{
                      unit.tickets }} </span> </p>
              </div>
              <div class="col-12 col-md-6 text-start  text-md-end fs-6 "><i class="fa fa-refresh"></i>
                {{ unit.latest_log.created_at }}</div>
            </div>

            <div class="row">
              <div class="col-lg-4 col-6 mb-3 ">
                <div class="d-flex justify-content-center mb-3">

                  <!-- <circle-progress 
                    :percent="20" 
                    size="120" 
                    border-width="10"
                    border-bg-width="10"
                    show-percent="true"
                    empty-color="#909090" 
                    :is-gradient="true"
                    :gradient="unit.latest_log.cpu_usage > 75 ? { angle: 180, startColor: '#ffc107', stopColor: '#dc3545' } : (unit.latest_log.cpu_usage > 50 ? { angle: 90, startColor: '#198754', stopColor: '#ffc107' } : { angle: 90, startColor: '#198754', stopColor: '#ffc107' })" /> -->
                  <RadialProgress 
                  :completedSteps="unit.latest_log.cpu_usage"
                  :totalSteps="100"
                  :diameter="140"
                  :strokeLinecap="'round'"
                  :animateSpeed="100"
                  :strokeWidth="10"
                  :innerStrokeWidth="10"
                  :startColor="unit.latest_log.cpu_usage > 75 ? '#dc3545' : unit.latest_log.cpu_usage > 50 ? '#ffc107':'#ffc107'"
                  :stopColor="unit.latest_log.cpu_usage > 75 ? '#ffc107' : unit.latest_log.cpu_usage > 50 ? '#198754':'#198754'"
                  :isClockwise="true"
                >
                  <div style="text-align: center;">
                    {{ unit.latest_log.cpu_usage }}%
                    <br>CPU Usage
                  </div>
                </RadialProgress>
                </div>
                <div class="fw-bold text-center"></div>
              </div>
              <div class="col-lg-4 col-6 mb-3 ">
                <div class="d-flex justify-content-center mb-3">
                    <RadialProgress 
                      :completedSteps="unit.latest_log.used_disk_percent"
                      :totalSteps="100"
                      :diameter="140"
                      :strokeLinecap="'round'"
                      :animateSpeed="100"
                      :strokeWidth="10"
                      :innerStrokeWidth="10"
                      :startColor="unit.latest_log.used_disk_percent > 75 ? '#dc3545' : unit.latest_log.used_disk_percent > 50 ? '#ffc107':'#ffc107'"
                      :stopColor="unit.latest_log.used_disk_percent > 75 ? '#ffc107' : unit.latest_log.used_disk_percent > 50 ? '#198754':'#198754'"
                      :isClockwise="true"
                    > 
                    <div style="text-align: center;">
                      {{ unit.latest_log.used_disk_percent }}%
                      <br>DISK
                    </div>
                  </RadialProgress>
                </div>
              </div>
              <div class="col-lg-4 col-6 mb-3 ">
                <div class="d-flex justify-content-center mb-3">
                  <circle-progress :percent="(unit.latest_log.used_ram / unit.latest_log.total_ram) * 100" size="120"
                    border-width="10" border-bg-width="10" show-percent="true" empty-color="#909090" :is-gradient="true"
                    :gradient="(unit.latest_log.used_ram / unit.latest_log.total_ram) * 100 > 75 ? { angle: 180, startColor: '#ffc107', stopColor: '#dc3545' } : ((unit.latest_log.used_ram / unit.latest_log.total_ram) * 100 > 40 ? { angle: 90, startColor: '#198754', stopColor: '#ffc107' } : { angle: 90, startColor: '#198754', stopColor: '#ffc107' })" />

                    <RadialProgress 
                      :completedSteps="(unit.latest_log.used_ram / unit.latest_log.total_ram) * 100"
                      :totalSteps="100"
                      :diameter="140"
                      :strokeLinecap="'round'"
                      :animateSpeed="100"
                      :strokeWidth="10"
                      :innerStrokeWidth="10"
                      :startColor="(unit.latest_log.used_ram / unit.latest_log.total_ram) * 100 > 75 ? '#dc3545' : (unit.latest_log.used_ram / unit.latest_log.total_ram) * 100 > 50 ? '#ffc107':'#ffc107'"
                      :stopColor="(unit.latest_log.used_ram / unit.latest_log.total_ram) * 100 > 75 ? '#ffc107' : (unit.latest_log.used_ram / unit.latest_log.total_ram) * 100 > 50 ? '#198754':'#198754'"
                      :isClockwise="true"
                    > 
                    <div style="text-align: center;">
                      {{ (unit.latest_log.used_ram +' of '+ unit.latest_log.total_ram) }}
                      <br>Ram
                    </div>
                  </RadialProgress>
                </div>
              </div>
            </div>
            <div class="Temperature">
              <h5 class="text-start mb-1 ">Temperature</h5>
              <div class="align-items-center d-flex mb-3">
                <div class="flex-grow-1 div1">
                  <div class="progress ">
                    <div class="progress-bar"
                      :class="unit.latest_log.cpu_temperature < 40 ? 'grad-success' : (unit.latest_log.cpu_temperature >= 40 && unit.latest_log.cpu_temperature <= 80 ? 'grad-warning' : 'grad-danger')"
                      role="progressbar" :style="{ width: unit.latest_log.cpu_temperature + '%' }" aria-valuemin="0"
                      aria-valuemax="100"></div>
                  </div>
                </div>
                <div class="div2 ps-2 fs-6">
                  <span class="fw-bold text-center p-1"
                    :class="unit.latest_log.cpu_temperature < 40 ? 'text-success' : (unit.latest_log.cpu_temperature >= 40 && unit.latest_log.cpu_temperature <= 80 ? '' : 'text-danger')">{{
                      unit.latest_log.cpu_temperature }}°C</span>
                </div>
              </div>
            </div>
            <div class="mt-3 d-flex flex-wrap">
              <div class="flex-fill p-2">
                <span :disabled="PERMISSION_3" @click="showAddtTckets(unit.id)" class="actionIcon"><i
                    class="fa fa-2x fa-pencil" data-bs-toggle="tooltip" data-bs-placement="bottom"
                    title="Edit"></i></span>
              </div>
              <div class="flex-fill p-2" v-if="unit.id != 5">
                <span :disabled="PERMISSION_9" @click="runCommand(unit.ip, unit.port, 'print', unit.id)"
                  class="actionIcon"><i class="fa fa-2x fa-print" data-bs-toggle="tooltip" data-bs-placement="bottom"
                    title="Print Ticket"></i></span>
              </div>
              <div class="flex-fill p-2">
                <span :disabled="PERMISSION_9" @click="runCommand(unit.ip, unit.port, 'open', unit.id)"
                  class="actionIcon"><i class="fa fa-2x fa-car" data-bs-toggle="tooltip" data-bs-placement="bottom"
                    title="Open Barrier"></i></span>
              </div>
              <div class="flex-fill p-2">
                <span :disabled="PERMISSION_9" @click="runCommand(unit.ip, unit.port, 'close', unit.id)"
                  class="actionIcon"><i class="fa fa-2x fa-close" data-bs-toggle="tooltip" data-bs-placement="bottom"
                    title="Close Barrier"></i></span>
              </div>
              <div class="flex-fill p-2">
                <span :disabled="PERMISSION_9" @click="runCommand(unit.ip, unit.port, 'shutdown', unit.id)"
                  class="actionIcon"><i class="fa fa-2x fa-power-off" data-bs-toggle="tooltip"
                    data-bs-placement="bottom" title="Shut Down"></i></span>
              </div>
              <div class="flex-fill p-2">
                <span :disabled="PERMISSION_9" @click="runCommand(unit.ip, unit.port, 'restart', unit.id)"
                  class="actionIcon"><i class="fa fa-2x fa-refresh" data-bs-toggle="tooltip" data-bs-placement="bottom"
                    title="Restart"></i></span>
              </div>
              <div class="flex-fill p-2">
                <span :disabled="PERMISSION_9" @click="openLogs(unit.ip)" class="actionIcon"><i
                    class="fa fa-2x fa-ticket" data-bs-toggle="tooltip" data-bs-placement="bottom"
                    title="Ticket Log"></i></span>
              </div>
              <div class="flex-fill p-2">
                <span :disabled="PERMISSION_9" @click="openErrorLogs(unit.ip)" class="actionIcon"><i
                    class="fa fa-2x fa-exclamation-triangle" data-bs-toggle="tooltip" data-bs-placement="bottom"
                    title="Error Log"></i></span>
              </div>
              <div class="flex-fill p-2">
                <span :disabled="PERMISSION_9" @click="runCommand(unit.ip, unit.port, 'active', unit.id)"
                  class="actionIcon"><i class="fa fa-2x fa-toggle-on" data-bs-toggle="tooltip"
                    data-bs-placement="bottom" :title="unit.is_active ? 'Inactive' : 'Active'"></i></span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="addTickets-modal" tabindex="-1" role="dialog" aria-labelledby="modalTitle"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document" style="max-width:80%;">
        <div class="modal-content">
          <div class="modal-body" style="position: relative">
            <div class="mb-3">
              <label for="exampleFormControlInput1" class="form-label">Add Number of Tickets</label>
              <input type="number" class="form-control" id="ticket_number" placeholder="Tickets #">
            </div>
            <div id="loader-addTickets" style="display: none " position="center">
              <img :src="LOADER" alt="loader">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" href="javascript:void(0)" @click="addTicketNumber()" class="btn btn-primary">Save
              changes
            </button>
            <button type="button" class="btn btn-secondary" @click="hideAddtTckets()">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal -->
  <div class="modal fade" id="modal-unit" tabindex="-1" role="dialog" aria-labelledby="modalTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document" style="max-width:80%;">
      <div class="modal-content">
        <div class="modal-body" style="position: relative">
          <div id="table-loader" style="display: none">
            <img :src="LOADER" alt="loader">
          </div>
          <div class="table-responsive tbl-header">
            <table class="table card-table text-nowrap mb-0">
              <thead>
                <tr>
                  <th class="border-bottom-0" width="20%">Ticket #</th>
                  <th class="border-bottom-0" width="20%">Time</th>
                  <th class="border-bottom-0" width="20%">Entry Type</th>
                  <th class="border-bottom-0" width="20%">Vehicle Plate</th>
                </tr>
              </thead>
            </table>
          </div>
          <div class="table-responsive tbl-content scrollbar h-350" id="">
            <table class="table card-table text-nowrap mb-0">
              <tbody id="data-tbody">
                <tr v-for="log in LogList">
                  <td>{{ log.code }}</td>
                  <td>{{ log.time_in }}</td>
                  <td>{{ log.type }}</td>
                  <td>{{ log.vehicle_plate }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="hideLog()">Close</button>
        </div>
      </div>
    </div>
  </div>
  <div class="modal fade" id="error-modal-unit" tabindex="-1" role="dialog" aria-labelledby="modalTitle"
    aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document" style="max-width:80%;">
      <div class="modal-content">
        <div class="modal-body" style="position: relative">
          <div id="table-loader-error-logs" style="display: none">
            <img :src="LOADER" alt="loader">
          </div>
          <div class="table-responsive tbl-header">
            <table class="table card-table text-nowrap mb-0">
              <thead>
                <tr>
                  <th class="border-bottom-0">Device</th>
                  <th class="border-bottom-0">File Location</th>
                  <th class="border-bottom-0">Description</th>
                  <th class="border-bottom-0">Our description</th>
                </tr>
              </thead>
            </table>
          </div>
          <div class="table-responsive tbl-content scrollbar h-350" id="">
            <table class="table card-table text-nowrap mb-0">
              <tbody id="data-tbody-error">
                <tr v-for="errorLog in ErrorLogList">
                  <td>{{ errorLog.device.name }}</td>
                  <td>{{ errorLog.file_location }}</td>
                  <td>{{ errorLog.description }}</td>
                  <td>{{ errorLog.our_description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="hideErrorLog()">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import RadialProgress from "vue3-radial-progress";

export default {
  components: {
    RadialProgress
  },

  data() {
    return {
      unit_id: null,
      LogList: [],
      ErrorLogList: [],
      site_id: '0',
      disabledDropDown: false,
      siteList: [],
      items: 10,
      tickets: 1000,
      unitList: [],
      loaderFlage:false,
      APP_NATURE: null,
      IS_ACCESS_CONTROL_ROGER: null,
      ENABLE_MEMBERSHIPS: null,
      MACHINE_API_COMMAND: null,
      VIP_ENTRY_ID: null,
      VIP_EXIT_ID: null,
      POS_EXIT_ID: null,
      SITES: null,
      LOADER: null,
      PERMISSION_3: null,
      PERMISSION_9: null,
      DATA_URL: null,
      UNIT_DATA_URL: null,
      TICKETS_ADD_URL: null,
      DEVICE_ACTIVE_URL: null,
      OPEN_BARRIER_URL: null,
      token: null,
    };
  },
  mounted() {
    this.APP_NATURE = (APP_NATURE)
    this.IS_ACCESS_CONTROL_ROGER = (IS_ACCESS_CONTROL_ROGER)
    this.ENABLE_MEMBERSHIPS = (ENABLE_MEMBERSHIPS)
    this.MACHINE_API_COMMAND = (MACHINE_API_COMMAND)
    this.VIP_ENTRY_ID = (VIP_ENTRY_ID)
    this.VIP_EXIT_ID = (VIP_EXIT_ID)
    this.POS_EXIT_ID = (POS_EXIT_ID)
    this.SITES = (SITES)
    this.LOADER = (LOADER)
    this.PERMISSION_3 = (PERMISSION_3)
    this.PERMISSION_9 = (PERMISSION_9)
    this.DATA_URL = (DATA_URL)
    this.UNIT_DATA_URL = (UNIT_DATA_URL)
    this.TICKETS_ADD_URL = (TICKETS_ADD_URL)
    this.DEVICE_ACTIVE_URL = (DEVICE_ACTIVE_URL)
    this.OPEN_BARRIER_URL = (OPEN_BARRIER_URL)
    this.token = (TOKEN);
    if (this.SITES) {
      var x = {
        id: 0,
        text: "All Sites"
      }
      this.siteList.push(x)
      this.SITES.forEach(element => {
        var x = {
          id: element.id,
          text: element.name
        }
        this.siteList.push(x)
      });
    }
    this.getData();
    // this.intervalId = setInterval(this.getData, 10000);
    // this.intervals.push(this.intervalId);
    window.onclick = function (event) {
      if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
          }
        }
      } else if (event.target.matches('.dropbtn')) {
        $(event.target).parent().find('.dropdown-content').toggleClass('show');
      }
    }
  },
  methods: {
    openWindow(url) {
      const windowName = '_blank'; // opens in a new tab
      const windowFeatures = 'noopener, noreferrer, toolbar=no, location=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=800,height=600';

      window.open(url, windowName, windowFeatures);
    },
    getData() {
      this.loaderFlage=true;
      var site_id = this.site_id
      this.disabledDropDown = true;
      var data = {
        site_id: site_id
      }
      this.axios.get(this.DATA_URL, { params: data }).then((response) => {
        if (response.status == 200) {
          this.unitList = response.data.units
          this.loaderFlage=false;
        }
        else {
          this.loaderFlage=false;
          this.$swal.fire({ icon: 'error', title: 'Error', })
        }
      })
        .catch((e) => { 
          this.loaderFlage=false;
          this.$swal.fire({ icon: 'error', title: 'Error', }) 
        });
    },
    changeSiteId(val) {
      // clearInterval(this.intervalId);
      // const index = this.intervals.indexOf(this.intervalId);
      // if (index > -1) {
      //   this.intervals.splice(index, 1);
      // }

      // this.intervalId = "";
      this.getData();

    },
    openBarrier(id) {
      let timerInterval
      this.$swal.fire({
        icon: 'warning', title: 'Please wait.....', timer: 500000, timerProgressBar: true, allowOutsideClick: false, showConfirmButton: false,
        didOpen: () => {
          this.$swal.showLoading()
          timerInterval = setInterval(() => {
            b.textContent = this.$swal.getTimerLeft()
          }, 50000)
        },
      }).then((result) => {
        if (result.dismiss === this.$swal.DismissReason.timer) {
          console.log('I was closed by the timer')
        }
      })
      var data = {
        _token: this.token,
        id: id
      }
      this.axios.post(this.OPEN_BARRIER_URL, data).then((response) => {
        if (response.status == 200) {
          this.$swal.fire({ icon: 'success', title: "Success!", type: "success", timer: 10000 })
        }
        else {
          this.$swal.fire({ icon: 'error', title: 'Error', })
        }
      })
        .catch((e) => { this.$swal.fire({ icon: 'error', title: 'Error', }) });
    },
    showAddtTckets(unit_id) {
      this.unit_id = unit_id
      $('#addTickets-modal').modal('show');
    },
    hideAddtTckets() {
      $('#addTickets-modal').modal('hide');
    },
    addTicketNumber() {
      var ticket_input = document.getElementById('ticket_number')
      if (this.unit_id) {
        var data = {
          ticket_number: ticket_input.value,
          unit_id: this.unit_id,
          _token: this.token
        }
        ticket_input.type = 'hidden';
        $('#loader-addTickets').fadeIn(200);
        this.axios.get(this.TICKETS_ADD_URL, data).then((response) => {
          if (response.status != undefined) {
            $('#addTickets-modal').modal('hide');
            this.$swal.fire({ position: 'top-end', icon: 'success', showConfirmButton: false, timer: 2000 })
            ticket_input.type = 'number';
            $('#loader-addTickets').fadeOut(200);
            this.getData();
          }
          else {
            this.$swal.fire({ icon: 'error', title: 'Please Enter Number of Tickets', })
            ticket_input.type = ticket_input.type = 'show';
            $('#loader-addTickets').fadeOut(200);
          }
        })
          .catch((e) => {
            this.$swal.fire({ icon: 'error', title: 'Please Enter Number of Tickets', })
            ticket_input.type = ticket_input.type = 'show';
            $('#loader-addTickets').fadeOut(200);
          });
      }
      ticket_input.value = '';
    },
    runCommand(ip, port, command, device_id) {
      let timerInterval
      this.$swal.fire({
        icon: 'warning', title: 'Please wait.....', timer: 1000, timerProgressBar: true, allowOutsideClick: false, showConfirmButton: false,
        didOpen: () => {
          this.$swal.showLoading()
        },
      }).then((result) => {
        if (result.dismiss === this.$swal.DismissReason.timer) {
          console.log('I was closed by the timer')
        }
      })
      if ((this.MACHINE_API_COMMAND, false) ? 1 : 0 == 1) {
        var data = {
          command: command
        }
        this.axios.post("http://" + ip + ":" + port + "/commands?command=" + command, data).then((response) => {
          if (response.status == 200) {
            this.$swal.fire({ icon: 'success', title: "Success!", type: "success", timer: 10000 })
            if (command == 'active') {
              var data_device = {
                _token: this.token,
                device_id: device_id
              }
              this.axios.post(this.DEVICE_ACTIVE_URL, data_device).then((response) => {
                this.getData()
              })
                .catch((e) => { this.$swal.fire({ icon: 'error', title: 'Error', }) });
            }

          }
          else {
            this.$swal.fire({ icon: 'error', title: 'Error', })
          }
        })
          .catch((e) => { this.$swal.fire({ icon: 'error', title: 'Error', }) });
      }
      else {
        this.axios.get("http://" + ip + "/commands.php?command=" + command, data).then((response) => {
          if (response.status == 200) {
            this.$swal.fire({ icon: 'success', title: "Success!", type: "success", timer: 10000 })
          }
          else {
            this.$swal.fire({ icon: 'error', title: 'Error', })
          }
        })
          .catch((e) => { this.$swal.fire({ icon: 'error', title: 'Error', }) });
      }
    },
    openLogs(unit_id) {
      this.unit_id = unit_id
      this.getUnitData();
      $('#modal-unit').modal('show');
    },
    hideLog() {
      $('#modal-unit').modal('hide');
    },
    getUnitData() {
      if (this.unit_id != "") {
        var data = {
          unit_id: this.unit_id,
          type_logs: "transactions",
        }
        $('#table-loader').fadeIn(200);
        this.axios.get(this.UNIT_DATA_URL, { params: data }).then((response) => {
          if (response.status == 200) {
            $('#data-tbody').html("");
            $('#table-loader').fadeOut(200);
            this.LogList = response.data;
            this.$swal.fire({ icon: 'success', title: "Success!", type: "success", timer: 10000 })
          }
          else {
            this.$swal.fire({ icon: 'error', title: 'Error', })
          }
        })
          .catch((e) => { this.$swal.fire({ icon: 'error', title: 'Error', }) });
      }
    },
    openErrorLogs(unit_id) {
      this.unit_id = unit_id
      this.getErrorUnitData();
      $('#error-modal-unit').modal('show');
    },
    getErrorUnitData() {
      if (this.unit_id != "") {
        var data = {
          unit_id: this.unit_id,
          type_logs: "error",
        }
        $('#table-loader-error-logs').fadeIn(200);
        this.axios.get(this.UNIT_DATA_URL, { params: data }).then((response) => {
          if (response.status == 200) {
            $('#table-loader-error-logs').fadeOut(200);
            this.ErrorLogList = response.data;
            this.$swal.fire({ icon: 'success', title: "Success!", type: "success", timer: 10000 })
          }
          else {
            this.$swal.fire({ icon: 'error', title: 'Error', })
          }
        })
          .catch((e) => { this.$swal.fire({ icon: 'error', title: 'Error', }) });
      }
    },
    hideErrorLog() {
      $('#error-modal-unit').modal('hide');
    },
  }
}
</script>

<style scoped>
#app {
  background-color: #eae8e8;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.fs-5 {
  font-size: 1.25rem !important;
}

.text-start {
  text-align: left !important;
}

.fs-6 {
  font-size: 1rem !important;
}

.end-0 {
  right: 0 !important;
}

.top-0 {
  top: 0 !important;
}

.fw-bold {
  font-weight: 700 !important;
}

@media (min-width: 768px) {
  .text-md-end {
    text-align: right !important;
  }
}

nav {
  padding: 30px;
}

.cam-pulse {
  position: absolute;
  top: 0.1rem;
  right: 0.2rem;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #f72d66;
  cursor: pointer;
  box-shadow: 0 0 0 rgba(247, 45, 102, 0.9);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(247, 45, 102, 0.9);
    box-shadow: 0 0 0 0 rgba(247, 45, 102, 0.7);
  }

  70% {
    -moz-box-shadow: 0 0 0 10px rgba(247, 45, 102, 0);
    box-shadow: 0 0 0 10px rgba(247, 45, 102, 0);
  }

  100% {
    -moz-box-shadow: 0 0 0 0 rgba(247, 45, 102, 0);
    box-shadow: 0 0 0 0 rgba(247, 45, 102, 0);
  }
}

.actionIcon {
  color: #fff;
}

.actionIcon:hover {
  color: #04AEEF;
}

.grad-success {
  background: linear-gradient(90deg, rgba(25, 135, 84, 1) 0%, rgba(255, 193, 7, 1) 100%);
}

.grad-warning {
  background: linear-gradient(90deg, rgba(25, 135, 84, 1) 0%, rgba(255, 193, 7, 1) 20%);
}

.grad-danger {
  background: linear-gradient(90deg, rgba(255, 193, 7, 1) 0%, rgba(220, 53, 69, 1) 57%);
}

.bgGray {
  background: linear-gradient(166deg, #045eb7, #012549 50%);
}

.card-header {
  background: transparent;
  display: -ms-flexbox;
  display: flex;
  min-height: 3.5rem;
  -ms-flex-align: center;
  align-items: center;
  padding: 0.5rem 1.5rem;
  margin-bottom: 0;
  border-bottom: 1px solid #eff0f6;
}

.card-header .card-title {
  margin-bottom: 0;
}

.card-header.border-0+.card-body {
  padding-top: 0;
}

.card-header:first-child {
  border-radius: calc(3px - 1px) calc(3px - 1px) 0 0;
}

.card-header+.list-group .list-group-item:first-child {
  border-top: 0;
}

.card-select {
  margin: 0 0 0 auto;
  width: 250px;
}

.select2-container--focus {
  outline: 1px auto #d3dfea;
}

.card {
  position: relative;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  position: relative;
  margin-bottom: 1.5rem;
  width: 100%;
  border: 0;
  box-shadow: 0px 10px 10px 20px rgba(176, 184, 214, 0.09), 10px 10px 15px -5px #b0b8d6;
  border-radius: 8px;
}

.cBlue {
  color: #424e79;
}

.ml-auto {
  margin-left: auto !important;
}

.pulse-unit {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 2%;
  display: block !important;
  cursor: default;
  box-shadow: 0 0 0 rgba(247, 45, 102, 0.9);
  animation: pulse 2s infinite;
}

.pulse-unit.green {
  box-shadow: 0 0 0 rgba(45, 247, 89, 0.9);
  animation: pulse-green 2s infinite;
}

@keyframes pulse-green {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(45, 247, 89, 0.9);
    box-shadow: 0 0 0 0 rgba(45, 247, 89, 0.7);
  }

  70% {
    -moz-box-shadow: 0 0 0 10px rgba(45, 247, 89, 0);
    box-shadow: 0 0 0 10px rgba(45, 247, 89, 0);
  }

  100% {
    -moz-box-shadow: 0 0 0 0 rgba(45, 247, 89, 0);
    box-shadow: 0 0 0 0 rgba(45, 247, 89, 0);
  }
}
</style>
