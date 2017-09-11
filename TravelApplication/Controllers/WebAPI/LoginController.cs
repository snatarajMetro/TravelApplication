﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Script.Serialization;

namespace TravelApplication.Controllers.WebAPI
{
    public class LoginController : ApiController
    {

        [HttpPost]
        [Route("api/login")]
        public HttpResponseMessage Login(UserModel userModel)
        {
            HttpResponseMessage response = null;

            try
            {
                //TODO:
                // Authenticate User
                // Get User Roles
                if(userModel == null || string.IsNullOrEmpty(userModel.UserName) || string.IsNullOrEmpty(userModel.Password))
                {
                    throw new Exception("Invalid username and/or password. Please try again.");
                }

                var roles = new List<Role>();
                roles.Add(new Role() { Id = 1, Name = "Submitter" });
                roles.Add(new Role() { Id = 2, Name = "Approver" });

                var user = new UserRole() { UserId = 100, UserName = userModel.UserName, Roles = roles };

                var data = new JavaScriptSerializer().Serialize(user);
                response = Request.CreateResponse(HttpStatusCode.OK, data);

                //throw new Exception();
            }
            catch (Exception)
            {
                response = Request.CreateResponse(HttpStatusCode.Unauthorized);
            }

            return response;
        }
    }

    public class UserModel
    {
        public string UserName { get; set; }
        public string Password { get; set; }
    }

    public class UserRole
    {
        public int UserId { get; set; }

        public string UserName { get; set; }

        public IEnumerable<Role> Roles { get; set; }
    }

    public class Role
    {
        public int Id { get; set; }

        public string Name { get; set; }
    }
}