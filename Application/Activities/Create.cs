
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

         
        public class Handler : IRequestHandler<Command , Result<Unit>>
        {
        private readonly IUserAccessor _userAccessor;
           
            private readonly DataContext _context;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public class CommandVaildator : AbstractValidator<Command>  
            {
                public CommandVaildator()
                {
                    RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
                }
            }     

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {

                var user = await _context.Users.FirstOrDefaultAsync(x => 
                x.UserName == _userAccessor.GetUsername());

                var attendee = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = request.Activity,
                    IsHost = true
                };

                _context.Activities.Add(request.Activity);

                var result = await _context.SaveChangesAsync() > 0;

                if(!result) return Result<Unit>.Failure("Failed to create activity");

                return Result<Unit>.Success(Unit.Value);
            }

            // public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            // {
            //     _context.Activities.Add(request.Activity);

            //     await _context.SaveChangesAsync();
            // }

          
            // public async Task Handle(Command request, CancellationToken cancellationToken)
            // {
            //     _context.Activities.Add(request.Activity);

            //      await _context.SaveChangesAsync();
            // }
        }
    }
}