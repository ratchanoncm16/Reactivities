
using System.Linq;
using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUsername = null;
            
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees
                    .FirstOrDefault(x => x.IsHost).AppUser.UserName));
            //  CreateMap<ActivityAttendee, AttendeeDto>()
            //      .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
            //      .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName)) 
            //      .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
            //      .ForMember(dest => dest.Image, options => options.MapFrom(src => src.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(dest => dest.DisplayName, options => options.MapFrom(src => src.AppUser.DisplayName))
                .ForMember(dest => dest.Username, options => options.MapFrom(src => src.AppUser.UserName))
                .ForMember(dest => dest.Image, options => options.MapFrom(src => src.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.Bio, options => options.MapFrom(src => src.AppUser.Bio))
                .ForMember(d => d.FollowersCount, o => o.MapFrom(s => s.AppUser.Followers.Count))
                .ForMember(d => d.FollowingCount, o => o.MapFrom(s => s.AppUser.Followings.Count))
                .ForMember(d => d.Following, o => o.MapFrom(s => s.AppUser.Followings.Any(x => x.Observer.UserName == currentUsername)));


            

            CreateMap<AppUser, Profiles.Profile>()
                  .ForMember(dest => dest.Image, options => options.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                 .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName)) 
                 .ForMember(dest => dest.Image, options => options.MapFrom(src => src.Author.Photos.FirstOrDefault(x => x.IsMain).Url));


            CreateMap<ActivityAttendee, UserActivityDto>()
            .ForMember(d => d.Id, o => o.MapFrom(s => s.Activity.Id))
            .ForMember(d => d.Date, o => o.MapFrom(s => s.Activity.Date))
            .ForMember(d => d.Title, o => o.MapFrom(s => s.Activity.Title))
            .ForMember(d => d.Category, o => o.MapFrom(s =>
            s.Activity.Category))
            .ForMember(d => d.HostUsername, o => o.MapFrom(s =>
            s.Activity.Attendees.FirstOrDefault(x =>
            x.IsHost).AppUser.UserName));

        }
    }
}