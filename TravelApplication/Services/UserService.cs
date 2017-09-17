using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using TravelApplication.DAL.Repositories;
using TravelApplication.Models;

namespace TravelApplication.Services
{
    public class UserService : IUserService
    {
        IUserRepository userRepo = new UserRepository();
        public UserRole ValidateAndGetRoles(UserModel userModel)
        {
            var response = userRepo.ValidateAndGetRoles(userModel);
            return response;
        }
    }
}