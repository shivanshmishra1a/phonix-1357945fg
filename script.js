const STORAGE = {users:"phonix_users", bookings:"phonix_bookings", services:"phonix_services", barbers:"phonix_barbers", token:"phonix_next_token", session:"phonix_session"};
const serviceSeeds = [
 {id:"haircut",name:"Haircut",price:250,duration:30,image:"https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=500&q=75"},
 {id:"beard",name:"Beard Trim",price:150,duration:20,image:"https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=500&q=75"},
 {id:"combo",name:"Haircut + Beard",price:350,duration:45,image:"https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=500&q=75"},
 {id:"wash",name:"Hair Wash",price:180,duration:20,image:"https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=500&q=75"},
 {id:"spa",name:"Hair Spa",price:600,duration:60,image:"https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=500&q=75"},
 {id:"facial",name:"Facial",price:500,duration:45,image:"https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=500&q=75"},
 {id:"colour",name:"Hair Colour",price:900,duration:90,image:"https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=500&q=75"}
];
const barberSeeds = [
 {id:"rahul",name:"Rahul",available:true,image:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=75"},
 {id:"aman",name:"Aman",available:true,image:"https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&q=75"},
 {id:"rohit",name:"Rohit",available:true,image:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=75"}
];
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const read = (key, fallback) => { try { const value=localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; } };
const write = (key,value) => localStorage.setItem(key,JSON.stringify(value));
const getServices = () => read(STORAGE.services,serviceSeeds);
const getBarbers = () => read(STORAGE.barbers,barberSeeds);
const getBookings = () => read(STORAGE.bookings,[]);
const getUsers = () => read(STORAGE.users,[]);
let selectedService=null, selectedBarber="Any Available Barber", signupMode=false, toastTimer;
function initData(){
 if(!localStorage.getItem(STORAGE.services)) write(STORAGE.services,serviceSeeds);
 if(!localStorage.getItem(STORAGE.barbers)) write(STORAGE.barbers,barberSeeds);
 if(!localStorage.getItem(STORAGE.bookings)) write(STORAGE.bookings,[]);
 if(!localStorage.getItem(STORAGE.users)) write(STORAGE.users,[]);
 if(!localStorage.getItem(STORAGE.token)) localStorage.setItem(STORAGE.token,"101");
}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),3000)}
function showView(id){
 $$(".view").forEach(v=>v.classList.toggle("active",v.id===id));
 window.scrollTo({top:0,behavior:"smooth"});
 if(id==="customer-auth") resetCustomerAuth();
 if(id==="customer-dashboard") renderCustomerDashboard();
 if(id==="owner-dashboard") renderOwnerDashboard();
 if(id==="live") renderLiveQueue();
}
document.addEventListener("click",e=>{
 const view=e.target.closest("[data-view]"); if(view){e.preventDefault();showView(view.dataset.view);return}
 const scroll=e.target.closest("[data-scroll]");if(scroll){e.preventDefault();showView("home");setTimeout(()=>document.getElementById(scroll.dataset.scroll)?.scrollIntoView({behavior:"smooth"}),80)}
});
$("#mobileMenu").addEventListener("click",()=>{$(".nav-links").classList.toggle("open")});
function resetCustomerAuth(){signupMode=false;$("#customerAuthTitle").textContent="Welcome back." ;$("#customerAuthSub").textContent="Sign in to manage your salon visit." ;$("#signupNameWrap").classList.add("hidden");$("#signupName").required=false;$("#customerSubmit").innerHTML='Sign In <span>↗</span>';$("#customerSwitch").innerHTML='New to PHONIX? <button id="toggleSignup">Create an account</button>';$("#customerPassword").value="";$("#customerIdentity").value=""}
$("#customerSwitch").addEventListener("click",e=>{if(e.target.id!=="toggleSignup")return;signupMode=!signupMode;$("#customerAuthTitle").textContent=signupMode?"Create your account.":"Welcome back.";$("#customerAuthSub").textContent=signupMode?"Join PHONIX for a smoother salon visit.":"Sign in to manage your salon visit." ;$("#signupNameWrap").classList.toggle("hidden",!signupMode);$("#signupName").required=signupMode;$("#customerSubmit").innerHTML=signupMode?"Create Account ↗":'Sign In <span>↗</span>';$("#customerSwitch").innerHTML=signupMode?'Already registered? <button id="toggleSignup">Sign in</button>':'New to PHONIX? <button id="toggleSignup">Create an account</button>'});
$("#customerLoginForm").addEventListener("submit",e=>{e.preventDefault();const identity=$("#customerIdentity").value.trim().toLowerCase(),password=$("#customerPassword").value;let users=getUsers(),user;
 if(signupMode){const name=$("#signupName").value.trim();if(!name){toast("Please enter your name.");return}if(users.some(u=>u.identity===identity)){toast("An account with this email or mobile already exists.");return}user={id:"u"+Date.now(),name,identity,password};users.push(user);write(STORAGE.users,users);toast("Account created. Welcome to PHONIX!")}
 else{user=users.find(u=>u.identity===identity&&u.password===password);if(!user){toast("Account not found or password is incorrect. Please sign up first.");return}toast("Welcome back, "+user.name.split(" ")[0]+".")}
 sessionStorage.setItem(STORAGE.session,JSON.stringify({type:"customer",userId:user.id}));showView("customer-dashboard");
});
$("#ownerLoginForm").addEventListener("submit",e=>{e.preventDefault();if($("#ownerEmail").value.trim().toLowerCase()==="owner@phonix.com"&&$("#ownerPassword").value==="admin123"){sessionStorage.setItem(STORAGE.session,JSON.stringify({type:"owner"}));toast("Owner access granted.");showView("owner-dashboard")}else toast("Incorrect owner email or password.")});
$("#customerLogout").addEventListener("click",()=>{sessionStorage.removeItem(STORAGE.session);showView("home");toast("You have been logged out.")});
$("#ownerLogout").addEventListener("click",()=>{sessionStorage.removeItem(STORAGE.session);showView("home");toast("Owner logged out.")});
function currentCustomer(){const s=readSession();return s?.type==="customer"?getUsers().find(u=>u.id===s.userId):null}
function readSession(){try{return JSON.parse(sessionStorage.getItem(STORAGE.session))}catch{return null}}
function renderCustomerDashboard(){
 const user=currentCustomer();if(!user){showView("customer-auth");return}
 $("#customerWelcome").textContent=user.name.split(" ")[0]+".";$("#bookingName").value=user.name;
 const latest=getBookings().filter(b=>b.userId===user.id).sort((a,b)=>b.createdAt-a.createdAt)[0];
 $("#bookingMobile").value=user.identity.match(/^\+?[0-9]{8,}$/)?user.identity:"";
 renderServiceCards();renderBarberCards();renderMyBooking(latest);updateBookingSummary();
}
function renderServiceCards(){
 $("#serviceGrid").innerHTML=getServices().map(s=>`<button type="button" class="service-option ${selectedService===s.id?"selected":""}" data-service="${s.id}"><img src="${s.image}" alt=""><div><strong>${s.name}</strong><small>${s.duration} min · <span class="price">₹${s.price}</span></small></div></button>`).join("");
}
function renderBarberCards(){
 const barbers=getBarbers();const all=[{id:"any",name:"Any Available",image:"",available:true},...barbers];
 $("#barberGrid").innerHTML=all.map(b=>`<button type="button" class="barber-option ${selectedBarber===(b.id==="any"?"Any Available Barber":b.name)?"selected":""}" data-barber="${b.id}">${b.image?`<img src="${b.image}" alt="${b.name}">`:'<div class="any-avatar">✦</div>'}<strong>${b.name}</strong><small>${b.available?"● Available":"● Unavailable"}</small></button>`).join("");
}
$("#serviceGrid").addEventListener("click",e=>{const b=e.target.closest("[data-service]");if(!b)return;selectedService=b.dataset.service;renderServiceCards();updateBookingSummary()});
$("#barberGrid").addEventListener("click",e=>{const b=e.target.closest("[data-barber]");if(!b)return;selectedBarber=b.dataset.barber==="any"?"Any Available Barber":getBarbers().find(x=>x.id===b.dataset.barber)?.name;renderBarberCards();updateBookingSummary()});
function updateBookingSummary(){const s=getServices().find(x=>x.id===selectedService);$("#bookingSummary").innerHTML=s?`<strong>${s.name}</strong> · ₹${s.price} · ${s.duration} minutes<br>Barber preference: ${selectedBarber}`:"Select a service and barber to see your booking summary."}
$("#bookingDate").min=new Date().toISOString().slice(0,10);$("#bookingDate").value=new Date().toISOString().slice(0,10);
$("#bookingForm").addEventListener("submit",e=>{e.preventDefault();const user=currentCustomer(),service=getServices().find(s=>s.id===selectedService);if(!user){showView("customer-auth");return}if(!service){toast("Please select a salon service.");return}const date=$("#bookingDate").value;if(!date){toast("Please select an appointment date.");return}const mobile=$("#bookingMobile").value.trim();if(!/^[0-9+() -]{8,16}$/.test(mobile)){toast("Please enter a valid mobile number.");return}
 const bookings=getBookings(),tokenNumber=Number(localStorage.getItem(STORAGE.token)||101),token="P"+tokenNumber;localStorage.setItem(STORAGE.token,String(tokenNumber+1));
 let barber=selectedBarber;if(barber==="Any Available Barber"){const counts=getBarbers().map(b=>({name:b.name,count:bookings.filter(x=>x.barber===b.name&&x.status!=="Completed").length})).sort((a,b)=>a.count-b.count);barber=counts[0]?.name||"Unassigned"}
 const booking={id:"b"+Date.now(),token,userId:user.id,customer:user.name,mobile,serviceId:service.id,service:service.name,price:service.price,duration:service.duration,barber,date,status:"Waiting",priority:0,createdAt:Date.now()};
 bookings.push(booking);write(STORAGE.bookings,bookings);$("#bookingMobile").value=mobile;renderMyBooking(booking);renderOwnerDashboard();renderLiveQueue();toast("Booking confirmed! Your token is "+token+".");
});
function getQueuePosition(booking){const active=getBookings().filter(b=>b.status!=="Completed"&&b.date===booking.date).sort((a,b)=>(b.priority-a.priority)||(a.createdAt-b.createdAt));return active.findIndex(b=>b.id===booking.id)+1}
function renderMyBooking(booking){const box=$("#myBookingContent");if(!booking){box.className="empty-state";box.innerHTML='<div class="empty-icon">✦</div><h3>No booking yet</h3><p>Your confirmed appointment and queue status will appear here.</p>';return}
 const position=booking.status==="Completed"?0:getQueuePosition(booking),wait=booking.status==="In Service"?0:Math.max(0,(position-1)*15);
 box.className="";box.innerHTML=`<div class="booking-ticket"><div class="ticket-top"><span>CONFIRMED BOOKING</span><span class="status-pill ${booking.status.toLowerCase().replace(" ","-")}">${booking.status}</span></div><div class="ticket-token">${booking.token}</div><div class="ticket-service">${booking.service}</div><div class="ticket-meta"><div><span>Barber</span><strong>${booking.barber}</strong></div><div><span>Date</span><strong>${formatDate(booking.date)}</strong></div><div><span>Queue position</span><strong>${booking.status==="Completed"?"Completed":position}</strong></div></div><div class="ticket-wait">${booking.status==="Completed"?"Your service is complete. Thank you for visiting!":booking.status==="In Service"?"Your service is now in progress.":`Estimated wait: about ${wait} minutes`}</div></div>`;
}
function formatDate(date){return new Date(date+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
function renderOwnerDashboard(){if(!$("#owner-dashboard").classList.contains("active"))return;const bookings=getBookings();const counts={total:bookings.length,waiting:bookings.filter(b=>b.status==="Waiting").length,service:bookings.filter(b=>b.status==="In Service").length,completed:bookings.filter(b=>b.status==="Completed").length};
 $("#statsGrid").innerHTML=[["TOTAL CUSTOMERS",new Set(bookings.map(b=>b.userId)).size,"Unique guests"],["WAITING",counts.waiting,"In the queue"],["IN SERVICE",counts.service,"On the salon floor"],["COMPLETED",counts.completed,"Finished visits"],["TOTAL TOKENS",counts.total,"All bookings"]].map(x=>`<div class="stat-card"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small></div>`).join("");
 renderQueueTable();renderAdminLists();
}
function renderQueueTable(){const query=($("#bookingSearch")?.value||"").toLowerCase(),filter=$("#statusFilter")?.value||"All";let bookings=getBookings().sort((a,b)=>(b.priority-a.priority)||(b.createdAt-a.createdAt));bookings=bookings.filter(b=>(filter==="All"||b.status===filter)&&[b.token,b.customer,b.service,b.barber].join(" ").toLowerCase().includes(query));
 $("#queueTableBody").innerHTML=bookings.map(b=>`<tr><td class="token-cell">${b.token}${b.priority?" ★":""}</td><td><strong>${escapeHTML(b.customer)}</strong><br><small>${escapeHTML(b.mobile)}</small></td><td>${escapeHTML(b.service)}</td><td><select class="barber-select" data-assign="${b.id}">${getBarbers().map(x=>`<option ${x.name===b.barber?"selected":""}>${escapeHTML(x.name)}</option>`).join("")}<option ${b.barber==="Unassigned"?"selected":""}>Unassigned</option></select></td><td>${formatDate(b.date)}</td><td><span class="status-pill ${b.status.toLowerCase().replace(" ","-")}">${b.status}</span></td><td><div class="action-cell">${b.status==="Waiting"?`<button class="mini-btn primary" data-action="start" data-id="${b.id}">Start</button>`:""}${b.status==="In Service"?`<button class="mini-btn primary" data-action="complete" data-id="${b.id}">Complete</button>`:""}${b.status!=="Completed"?`<button class="mini-btn" data-action="priority" data-id="${b.id}" title="Move to priority">★</button>`:""}</div></td></tr>`).join("");
 $("#queueEmpty").classList.toggle("hidden",bookings.length>0);
}
function escapeHTML(str){return String(str).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
$("#bookingSearch").addEventListener("input",renderQueueTable);$("#statusFilter").addEventListener("change",renderQueueTable);
$("#queueTableBody").addEventListener("click",e=>{const btn=e.target.closest("[data-action]");if(!btn)return;const bookings=getBookings(),b=bookings.find(x=>x.id===btn.dataset.id);if(!b)return;
 if(btn.dataset.action==="start"){b.status="In Service";toast(b.token+" is now in service.")}
 if(btn.dataset.action==="complete"){b.status="Completed";toast(b.token+" marked completed.")}
 if(btn.dataset.action==="priority"){b.priority=b.priority?0:1;toast(b.priority?"Priority updated.":"Priority removed.")}
 write(STORAGE.bookings,bookings);renderOwnerDashboard();renderLiveQueue();
});
$("#queueTableBody").addEventListener("change",e=>{const id=e.target.dataset.assign;if(!id)return;const bookings=getBookings(),b=bookings.find(x=>x.id===id);if(b){b.barber=e.target.value;write(STORAGE.bookings,bookings);toast("Barber assignment updated.");renderLiveQueue()}});
function renderAdminLists(){
 $("#adminBarberList").innerHTML=getBarbers().map(b=>`<div class="manage-row"><div><strong>${escapeHTML(b.name)}</strong><small>${b.available?"Available":"Unavailable"}</small></div><button data-toggle-barber="${b.id}">${b.available?"SET OFF":"SET ON"}</button></div>`).join("");
 $("#adminServiceList").innerHTML=getServices().map(s=>`<div class="manage-row"><div><strong>${escapeHTML(s.name)}</strong><small>${s.duration} min · ₹${s.price}</small></div><button data-edit-service="${s.id}">EDIT PRICE</button></div>`).join("");
}
$("#adminBarberList").addEventListener("click",e=>{const id=e.target.dataset.toggleBarber;if(!id)return;const barbers=getBarbers(),b=barbers.find(x=>x.id===id);b.available=!b.available;write(STORAGE.barbers,barbers);renderAdminLists();renderBarberCards();toast("Barber availability updated.")});
$("#adminServiceList").addEventListener("click",e=>{const id=e.target.dataset.editService;if(!id)return;const services=getServices(),s=services.find(x=>x.id===id),price=prompt("Enter new price for "+s.name+" (₹):",s.price);if(price===null)return;const value=Number(price);if(!Number.isFinite(value)||value<0){toast("Enter a valid price.");return}s.price=value;write(STORAGE.services,services);renderAdminLists();renderServiceCards();updateBookingSummary();toast("Service price updated.")});
$("#addBarberBtn").addEventListener("click",()=>{const name=prompt("Enter the new barber's name:");if(!name?.trim())return;const barbers=getBarbers();if(barbers.some(b=>b.name.toLowerCase()===name.trim().toLowerCase())){toast("That barber already exists.");return}barbers.push({id:"barber"+Date.now(),name:name.trim(),available:true,image:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=75"});write(STORAGE.barbers,barbers);renderAdminLists();renderBarberCards();toast("New barber added.")});
function renderLiveQueue(){const bookings=getBookings().filter(b=>b.status!=="Completed").sort((a,b)=>a.status==="In Service"?-1:b.status==="In Service"?1:(b.priority-a.priority)||(a.createdAt-b.createdAt));const now=bookings.find(b=>b.status==="In Service"),waiting=bookings.filter(b=>b.status==="Waiting"),next=waiting[0];
 $("#nowServing").textContent=now?.token||"— — —";$("#nowService").textContent=now?now.service:"Ready for the next guest";$("#nowBarber").textContent=now?"With "+now.barber:"Your barber will be with you shortly";
 $("#upNext").textContent=next?.token||"— — —";$("#nextCustomer").textContent=next?next.customer:"No one waiting";$("#nextService").textContent=next?next.service+" · "+next.barber:"The next token will appear here.";
 $("#liveWaitingList").innerHTML=waiting.length?waiting.map(b=>`<div class="waiting-row"><strong>${b.token}</strong><span>${escapeHTML(b.customer)}</span><small>${escapeHTML(b.service)} · ${escapeHTML(b.barber)}</small><span class="waiting-status">WAITING</span></div>`).join(""):'<div class="waiting-empty">The waiting area is clear. New bookings will appear here.</div>';
 $("#liveClock").textContent=new Date().toLocaleString("en-IN",{weekday:"short",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});
}
window.addEventListener("storage",e=>{if([STORAGE.bookings,STORAGE.barbers,STORAGE.services].includes(e.key)){renderOwnerDashboard();renderLiveQueue();if($("#customer-dashboard").classList.contains("active"))renderCustomerDashboard()}});
setInterval(()=>{if($("#live").classList.contains("active"))renderLiveQueue();},5000);
initData();
const existingSession=readSession();if(existingSession?.type==="owner")showView("owner-dashboard");else if(existingSession?.type==="customer"&&currentCustomer())showView("customer-dashboard");else showView("home");
