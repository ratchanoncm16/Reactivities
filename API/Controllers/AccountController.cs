using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        public UserManager<AppUser> _userManager { get; }
        public TokenService _tokenService { get; }
        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            _tokenService = tokenService;
            _userManager = userManager;

        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login (LoginDto loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);

            if(user == null) return Unauthorized();

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if(result)
            {
                return CreateUserObject(user);
            }

            return Unauthorized();
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register (RegisterDto registerDto)
        {
            // if(await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            // {
            //     ModelState.AddModelError("email", "Email taken");
            //     return ValidationProblem();
            // }
             if (await _userManager.FindByEmailAsync(registerDto.Email) != null)
            {
                ModelState.AddModelError("email", "Email already in use");
                return ValidationProblem();
            }
            if (await _userManager.Users.AnyAsync(u => u.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("username", "username already in use");
                return ValidationProblem();
            }

            // if(await _userManager.Users.AnyAsync(x => x.UserName == registerDto.UserName))
            // {
            //     ModelState.AddModelError("username", "Username taken");
            //     return ValidationProblem();
            // }

           

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.UserName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if(result.Succeeded)
            {
                return CreateUserObject(user);

            }

            return BadRequest(result.Errors);
        }

        
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser ()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));

            return CreateUserObject(user);
        }
        
        private UserDto CreateUserObject(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = null,
                Token = _tokenService.CreateToken(user),
                UserName = user.UserName
            };
        }


        [Authorize]
        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.Users.Include(r => r.RefreshTokens).FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

            if (user == null) return Unauthorized();

            var oldToken = user.RefreshTokens.FirstOrDefault(x => x.Token == refreshToken);

            if (oldToken != null && !oldToken.IsActive) return Unauthorized();

            if (oldToken != null) oldToken.Revoked = DateTime.UtcNow;

            return CreateUserObject(user);
        }


    }
}