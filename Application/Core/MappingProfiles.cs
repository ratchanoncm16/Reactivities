
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
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(d => d.HostUsername, o => o.MapFrom(s => s.Attendees
                    .FirstOrDefault(x => x.IsHost).AppUser.UserName));
             CreateMap<ActivityAttendee, AttendeeDto>()
                 .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.AppUser.DisplayName))
                 .ForMember(d => d.Username, o => o.MapFrom(s => s.AppUser.UserName)) 
                 .ForMember(d => d.Bio, o => o.MapFrom(s => s.AppUser.Bio))
                 .ForMember(dest => dest.Image, options => options.MapFrom(src => src.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<AppUser, Profiles.Profile>()
                  .ForMember(dest => dest.Image, options => options.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url));
            CreateMap<Comment, CommentDto>()
                .ForMember(d => d.DisplayName, o => o.MapFrom(s => s.Author.DisplayName))
                 .ForMember(d => d.Username, o => o.MapFrom(s => s.Author.UserName)) 
                 .ForMember(dest => dest.Image, options => options.MapFrom(src => src.Author.Photos.FirstOrDefault(x => x.IsMain).Url));

        }
    }
}